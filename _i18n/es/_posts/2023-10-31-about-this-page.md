---
layout: post
title: Sobre esta página
---

En un principio creé esta página con fines profesionales y laborales. Las primeras secciones fueron las de mi cv, sobre mí y proyectos. Sólo después comencé a agregar aquellas más personales como "me gusta" y el blog con posts. Aún la sección de sobre mí tiene un enfoque profesional más que personal, en en el futuro planeo actualizarla.

Aunque no planeaba escribir mucho al principio, quería dejar la opción abierta para el futuro en caso de que cambiara de opinión y/o le agarre el gusto/ritmo a escribir. Por esta razón es que fue creada con [Jekyll](https://jekyllrb.com/). Probé otras opciones como [Hugo](https://gohugo.io/) pero al final me terminó convenciendo Jekyll por la facilidad de uso y diversidad de plugins.

Para poder mostrar el contenido en español e inglés uso [jekyll-multiple-languages-plugin](https://github.com/kurtsson/jekyll-multiple-languages-plugin). Costó un poco al principio configurarlo a mi gusto pero ya estoy conforme con el resultado.

Quería evitar utilizar JavaScript todo lo posible para concentrarme sólo en el contenido de la página en términos del blog y como carta de presentación de mi, mis proyectos, fotos, gustos, etc. Por lo que hay sólo un pequeño script para la visiblidad de la sidebar en la vista mobile. Quizás esa funcionalidad puede ser lograda sólo con HTML/CSS pero considerando que son únicamente 6 líneas de código encontré más fácil hacerlo así.

## Imagenes

Las imagenes en [fotos](/es/fotos) y en [leyendo](/es/leyendo) son cargadas en forma diferida usando `loading="lazy"` en cada `img` y un mínimo de altura (para evitar que todas sean cargadas a la vez; al tener dimensiones de 0x0 en una primera instancia si el valor `height` no es especificado). A su vez, utilizo `srcset` con dos opciones de imagenes para cada caso, una para mobile y otra para tablet/desktop, evitando así enviar imagenes innecesariamente grandes a dispositivos chicos. 

Con el objetivo de reducir lo máximo posible el peso de las imagenes de la sección fotos antes de incluirlas en el repositorio las comprimo usando [Tinyjpg](https://tinyjpg.com/). Una imagen de 235.8KB con 1280px de ancho es reducida a 166.4KB por ejemplo: un 29% menos. Vale el pequeño esfuerzo. Para una única imagen puede no ser mucho pero considerando que a futuro me gustaría agregar tantas imagenes como quisiera y no siempre tenemos Wi-Fi disponible para no preocuparnos por el peso de los archivos recibidos es que incluyo este paso extra.

Para mis fotos, uso una custom [collection](https://jekyllrb.com/docs/collections/) ya que quería tener un archivo markdown para cada una. Lo que me permite agregar un título (`title`) y un atributo `alt` para las versiones en español y en inglés de la página respectivamente.

## Hosting

Uso [GitHub Pages](https://pages.github.com/) con un dominio custom. El repositorio de la página se puede encontrar [aquí](https://github.com/luz-ojeda/luz-ojeda.github.io).

También configuré GitHub Actions para que cualquier push a la rama "master" gatille un build y un deploy. Al usar `jekyll-multiple-languages-plugin` y descubrir que no está en [lista de plugins permitidos](https://pages.github.com/versions/) de GitHub Pages, uso la GitHub action [jekyll-deploy- action](https://github.com/jeffreytse/jekyll-deploy-action) por lo que el proyecto primero se buildea localmente y luego se deploya en la rama `gh-pages` lo que finalmente gatilla la publicación a GitHub pages mostrando los últimos cambios.
