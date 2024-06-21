---
layout: post
title: "Un ejemplo del principio de segregación de interfaz"
tag: tech
---

El principio de segregación de interfaces de [SOLID](https://en.wikipedia.org/wiki/SOLID) establece que "no se debe obligar a los clientes a depender de interfaces que no utilizan".

Trabajando en [Endgame](https://github.com/luz-ojeda/c-players-guide-endgame), el proyecto final del libro C# Player's Guide, aproveché una oportunidad de aplicarlo. El proyecto es una aplicación de consola de juegos de rol con personajes. Cada uno en un grupo (héroes o monstruos).

Al principio tenía una única interfaz `ICharacter` que se veía más o menos así:

```csharp
public interface ICharacter
{
	string Name { get; set; }
	string AttackName { get; }
	Task Act(IAction action);
}
```

Una implementación de esta interfaz fue el personaje del jugador, antes de implementar la acción de ataque adecuada:

```csharp
public class TrueProgrammer : ICharacter
{
	public string Name { get; set; } = "TOG";
	public string AttackName { get; } = "PUNCH";
	public float MaxHP { get; } = 25;
	public float HP { get; set; }

	public async Task Act()
	{
		await Statics.Console.WriteLine($"{Name} did NOTHING.");
	}
}
```

También creé otros personajes como el jefe final y esqueletos:

```csharp
public class Skeleton : ICharacter
{
	public string Name { get; set; } = "Skeleton";
	public string AttackName { get; } = "BONE CRUNCH";
	public float MaxHP { get; } = 5;
	public float HP { get; set; }

	public async Task Act()
	{
		await Statics.Console.WriteLine($"{Name} did NOTHING.");
	}
}
```

Las otras clases relacionadas para ejecutar el juego son `Battle`, `Party` y `AttackAction`.

`Battle` representa cada batalla en el juego con las partes asociadas jugando el turno de cada parte alternativamente. Cuando el usuario o la computadora eligen atacar a un objetivo de la otra parte, se ejecuta el método `Ejecutar` de `AttackAction`:

```csharp
public async Task Run(ICharacter character, Battle battle)
	{
		float damage = character.Attack.Damage;
		if (_target.HP - damage <= 0)
		{
			_target.HP = 0;
			RemoveCharacterFromParty(_target, battle);
		}
		else
		{
			// reducir putnos de vida
		}
	}

	private void RemoveCharacterFromParty(ICharacter character, Battle battle)
	{
		if (character.PartyType == PartyType.Monsters)
		{
			battle.Monsters.Characters.Remove(character);
		}
		else
		{
			battle.Heroes.Characters.Remove(character);
		}
	}
```

Esto empezó a hacerme ruido ya que tenía que pasar toda la instancia de `Battle` a cada acción *solo* para eliminar al personaje del grupo (ir "subiendo" a la batalla, luego bajando al grupo del personaje).

Mi primera idea fue crear un método `Die()` que emitiera un `evento`. Luego, las partes se suscribirían y eliminarían los personajes que emitieron el evento.

Pero haciendo esto:

```csharp
public interface ICharacter
{
	...
    void Die();
    event Action<ICharacterCore>? CharacterDied;
}
```
Me llevaría a implementar el mismo código para cada personaje que murió. `Skeleton` debería tener una implementación de `Die()` así como cualquier otra de las decenas de caracteres que pudiera agregar más adelante.

Entonces, con respecto al título del post, creé otra interfaz:

```csharp
public interface ICharacterCore
{
	void Die();
	event Action<ICharacterCore>? CharacterDied;
}
```

Una que implemente ambas:

```csharp
public interface IPartyCharacter : ICharacter, ICharacterCore;
```

...una clase base que implemente `ICharacterCore` y el método `Die()`:

```csharp
public class Character : ICharacterCore
{
	public event Action<ICharacterCore>? CharacterDied;

	public void Die()
	{
		CharacterDied?.Invoke(this);
	}
}
```

Y finalmente actualicé las clases de personajes para que hereden `Character`, implementen `IPartyCharacter` y así heredar el método `Die()`:

```csharp
public class TrueProgrammer : Character, IPartyCharacter
{
	...
}
```
Esto llevó a un método `Run` simplificado y también a un enfoque más intuitivo. Considerando que es mejor que la instancia `Party` sea responsable de eliminar caracteres, no una acción.

```csharp
public async Task Run(ICharacter character, Battle battle)
	{
		float damage = character.Attack.Damage;
		if (_target.HP - damage <= 0)
		{
			_target.HP = 0;
			_target.Die();
		}
		else
		{
			// reducir puntos de vida
			...
		}
	}

	// No es necesario el método RemoveCharacterFromParty()
```

El uso de dos interfaces (`ICharacterCore` y `ICharacter`) en lugar de solo una (`ICharacter`) me permitió implementar la función de eliminación de Parties y el método `Die` desde un solo lugar en lugar de varios. Puede haber otros enfoques para evitar la repetición de la implementación `Die()` además de varias interfaces, pero estoy satisfecho con este.

Además, quizás notaste que ambos personajes tenían la misma implementación `Act()`. Ese método se modificó posteriormente y también se trasladó a cada clase de ataque diferente.

Lo siguiente no está relacionado con el principio de segregación de la interfaz, pero si amplía sobre cómo terminé de implementar `Party`:

```csharp
public class Party
{
	public PartyType Type { get; set; }
	public List<IPartyCharacter> Characters { get; set; } = [];
	public PlayerType PlayerInControl { get; set; }
	public List<IPartyItem> Items { get; set; } = [];
	public List<IPartyGear> Gear { get; set; } = [];

	public Party(PartyType type, PlayerType playerInControl = PlayerType.Computer)
	{
		// Inicialización y asignación de elementos según el tipo de parte
        ...

		if (characterCore is IPartyCharacter character && Characters.Contains(character))
		{
			Characters.Remove(character);
		}
	}

	// Otros métodos
	...
}
```