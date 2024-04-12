---
layout: post
title: "Subida de archivos a Azure Blob Storage con SvelteKit"
---

Trabajando en la creación de recetas en [cook web](https://github.com/luz-ojeda/cook-web) implementé la subida de imágenes de estas a Azure Blob Storage.

El diagrama general del proceso real en mi aplicación es el siguiente (voy a usar los números de cada parte como referencia más adelante):

![Diagram of the file upload feature involving SvelteKit app, .NET API and Azure Blob Storage](/assets/images/svelte_file_upload/diagram.jpeg)
{: .wide-img}

Con fines ilustrativos voy a tratar de abstraerme lo máximo posible de lo concreto de mi caso en particular.

Versiones:

-   [Svelte](https://www.npmjs.com/package/svelte) 4.2.7
-   [SvelteKit](https://www.npmjs.com/package/@sveltejs/kit) 2.0.0
-   [Vite](https://www.npmjs.com/package/vite) 5.0.3
-   [Azure Storage Blob client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob#azure-storage-blob-client-library-for-javascript) 12.17.0
-   Typescript 5.0.0

---

## 1
La parte del cliente de SvelteKit es relativamente sencilla, en una página `+page.svelte` colocamos:

```html
<script lang="ts">
    let files: FileList | null;
    let fileInput: HTMLInputElement;
</script>
```

```html
<form method="POST" enctype="multipart/form-data">
    <!-- El valor del atributo Accept es un ejemplo, podemos usar el valor que deseemos -->
    <input 
	accept="image/png, image/jpg" 
	bind:files 
	id="myFile" 
	name="myFile" 
	type="file" 
	/>
	<input 
	name="nombre" 
	type="text" 
	/>
    <button type="submit">Subir archivo</button>
</form>
```

Algo importante a destacar es el valor del atributo `enctype` en el elemento `form`. Es necesario utilizarlo si usas [`use:enhance`](https://kit.svelte.dev/docs/form-actions#progressive-enhancement) por lo descrito en esta [issue](https://github.com/sveltejs/kit/issues9819). Si no al momento de presionar el botón submit se produce este error de consola y no se ejecuta la acción de POST:

![alt text](/assets/images/svelte_file_upload/enctype_error.png)

Para fines ilustrativos, no configuré use:enhance en el ejemplo anterior. Pero como sí lo hice en mi repositorio pensé que valía la pena mencionarlo. En su momento, me tomó unos minutos hasta abrir la consola para descubrir por qué no pasaba nada cuando intentaba enviar el formulario.

## 2 - 4
En la misma ruta del archivo `+page.svelte` debemos tener un archivo `+page.server.ts` que exporte una *acción*, la cual será gatillada al ser submitteado el formulario ([docs](https://kit.svelte.dev/docs/form-actions)). El archivo puede exportar más de una acción además de la exportada por defecto (*named actions* se las llama en la documentación). En este caso solo necesitamos una.

```typescript
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const fileToUpload = data.get('myFile') as File;
		// data.get('') devuelve un valor de tipo FormDataEntryValue el cual
		// es una unión de File y string por lo que podemos hacer un assert
		// a File con la keyword as

		const entityName = data.get('nombre');

		// Creación de la entidad a través de la API en la DB
		const body = {
			name: entityName,
			files: [`https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${name}`]
		};

		const response = await fetch(`${env.API_URL}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body)
		});

		...
	}
} satisfies Actions;
```
El archivo se obtiene llamando [`FormData.get`](https://developer.mozilla.org/es/docs/Web/API/FormData). Luego armamos el cuerpo de la solicitud para enviar a nuestra API y usamos fetch para ejecutarla.

La propiedad `files` en el cuerpo de la solicitud nos permite en un front end que consuma los datos de la API, saber a qué URL corresponde la imagen de la entidad asociada (un usuario, un post, una receta de cocina, etc.).

## 5-7
Aún en la acción `default` de `+page.server.ts`, si la respuesta de la API es exitosa (código de estado 201), procedemos con la subida del archivo a Azure:

```typescript
	...
	if (response.status === 201) {
		const responseJson = await response.json();

		if (fileToUpload !== null) {
			await uploadFile(fileToUpload, entityName);
		}
		return { success: true, data: responseJson };
	}
	return fail(response.status);
	...
```

Para la subida vamos a necesitar dos elementos:
1. Una [firma de acceso compartido SAS](https://learn.microsoft.com/es-es/azure/storage/common/storage-sas-overview) (a.k.a. SAS token): brinda acceso delegado a recursos en una ventana de tiempo determinada, con permisos limitados, etc. 
2. Una [clave de acceso](https://learn.microsoft.com/es-es/azure/storage/common/storage-account-keys-manage?tabs=azure-portal) a la cuenta de almacenamiento en Azure

Ambos elementos no deben ser expuestos al cliente por razones de seguridad y es por eso, en parte, que realizamos este proceso del lado del server de SvelteKit.

Para la firma de accesso compartido SAS necesitamos primero instalar el paquete [@azure/storage-blob](https://www.npmjs.com/package/@azure/storage-blob):

```bash
npm install @azure/storage-blob
```
Con la siguiente función podemos crear la firma:

```typescript
import {
	generateAccountSASQueryParameters,
	StorageSharedKeyCredential,
	AccountSASServices,
	AccountSASResourceTypes,
	AccountSASPermissions,
	SASProtocol,
	BlobServiceClient
} from '@azure/storage-blob';

...

function createSasToken() {
	const sasOptions = {
		services: AccountSASServices.parse('b').toString(),
		resourceTypes: AccountSASResourceTypes.parse('co').toString(),
		permissions: AccountSASPermissions.parse('w'),
		protocol: SASProtocol.Https,
		expiresOn: new Date(new Date().valueOf() + 3 * 60 * 1000) // 3 minutos
	};

	const constants = {
		accountName: env.AZURE_STORAGE_ACCOUNT_NAME,
		accountKey: env.AZURE_STORAGE_ACCOUNT_KEY
	};

	const sharedKeyCredential = new StorageSharedKeyCredential(
		constants.accountName,
		constants.accountKey
	);

	return generateAccountSASQueryParameters(sasOptions, sharedKeyCredential).toString();
}
```
En `sasOptions` establecemos que el token:
- Tiene permiso para acceder a containers y objetos ('bo') del servicio Blob ('b')
- Tiene permiso de escritura ('w')
- Solo puede acceder a través de HTTP
- Expira luego de unos 3 minutos.

Junto al nombre de la cuenta de almacenamiento y su clave podemos generar la firma con `generateAccountSASQueryParameters`. Utilicé [este material](https://learn.microsoft.com/es-es/azure/storage/blobs/storage-blob-account-delegation-sas-create-javascript?tabs=blob-service-client) como referencia.

Finalmente para utilizarlo al subir el archivo usamos la siguiente función:

```typescript
async function uploadFile(file: File, blobName: string) {
	const sasToken = createSasToken();
	const blobServiceClient = new BlobServiceClient(
		`https://${env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net?${sasToken}`
	);
	const containerClient = blobServiceClient.getContainerClient('ourContainerName');
	const blockBlobClient = containerClient.getBlockBlobClient(blobName);

	try {
		await blockBlobClient.uploadData(Buffer.from(await file.arrayBuffer()));
	} catch (error) {
		console.error(`An error happened while trying to upload the file: ${error}`);
	}
}
```
Si se obtiene un error de CORS [este link](https://stackoverflow.com/questions/28894466/how-can-i-set-cors-in-azure-blob-storage-in-portal) es de ayuda.

## 8
Finalmente, la action en nuestro `+page.server.ts` tendrá una forma como la siguiente:

```typescript
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const fileToUpload = data.get('myFile') as File;
		const entityName = data.get('name');

		const body = {
			name,
			files: [`https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${name}`]
		};

		// POST /entidades y creación en la DB
		const response = await fetch(`${env.API_URL}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body)
		});

		// 5 API responde con código de éxito 201
		if (response.status === 201) {
			const responseJson = await response.json();

			if (fileToUpload !== null) {
				// 6 y 7 generación de token SAS y subida de archivo a Azure Blob Storage
				await uploadFile(file, entityName);
			}
			// 8 Respuesta de éxito al cliente
			return { success: true, data: responseJson };
		}
		return fail(response.status);
	}
} satisfies Actions;
```

La función `uploadFile` puede ser incluida en el mismo archivo u otro, dependiendo la organización del proyecto y cada uno.

Cualquier duda no hay problema con comunicarse via e-mail (luzojeda@proton.me). En [cook-web](https://github.com/luz-ojeda/cook-web) en `src/routes/admin/crear-receta` hay un ejemplo concreto utilizando lo anterior pero dependiendo la fecha puede ser que ya haya cambiado algo de la implementación.

Referencias:
- [How to implement file upload with SvelteKit](https://www.okupter.com/blog/sveltekit-file-upload)
- [Upload a blob with JavaScript](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-upload-javascript)
- [Create and use account SAS tokens with Azure Blob Storage and JavaScript](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-account-delegation-sas-create-javascript?tabs=blob-service-client)