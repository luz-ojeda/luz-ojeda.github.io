---
layout: post
title: "An example of the interface segregation principle"
---

The interface segregation principle from [SOLID](https://en.wikipedia.org/wiki/SOLID) states that “clients should not be forced to depend upon interfaces that they do not use”.

Working in [Endgame](https://github.com/luz-ojeda/c-players-guide-endgame), the final project for the C# Player's Guide book, I got the opportunity to apply it. The project is a role-playing game console application with characters in it. Each one in a party (heroes or monsters).

In the beginning I had one single `ICharacter` interface which looked like this

```csharp
public interface ICharacter
{
	string Name { get; set; }
	string AttackName { get; }
	Task Act(IAction action);
}
```

One implementation was the player's character (before implementing the proper attack action):

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

I also had other characters such as the final boss and skeletons:

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

The other related classes to run the game were the `Battle`, `Party` and `AttackAction`.

`Battle` represented each battle in the game with the parties associated playing each party's turn alternatively. When user or the computer chose to attack a target from the other party the `Run` method of the `AttackAction` was executed:

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
			// reduce hp
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

This started looking weird to me since I had to pass the whole `Battle` instance to each action *just* to remove the character from the party (going "up" to battle, then down to the character's party).

My first idea was to create a `Die()` method that would emit an `event`. Parties would then subscribe to it and remove characters that emitted the event.

But doing this:

```csharp
public interface ICharacter
{
	...
    void Die();
    event Action<ICharacterCore>? CharacterDied;
}
```

Would led me to implement the same code for each character that died (`Skeleton` should have a `Die()` implementation as well as any other of tens of characters I would want to add later).

So, regarding the post's title I created another interface:

```csharp
public interface ICharacterCore
{
	void Die();
	event Action<ICharacterCore>? CharacterDied;
}
```

One that implemented both:

```csharp
public interface IPartyCharacter : ICharacter, ICharacterCore;
```

...a base class that implemented `ICharacterCore` and the `Die()` method:

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

And finally updated the character classes to inherit `Character`, implement `IPartyCharacter` and thus inherit `Die()`:

```csharp
public class TrueProgrammer : Character, IPartyCharacter
{
	...
}
```
This led to a simplified `Run` method and also a more intuitive approach. Since, IMO, it's better for the `Party` instance to be responsible of removing characters from it, not an action.

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
			// reduce hp
			...
		}
	}

	// No need for RemoveCharacterFromParty() method
```

So, using two interfaces (`ICharacterCore` and `ICharacter`) instead of only one (`ICharacter`) let me implement the Die and party removal feature from only one place instead of several. There may be other approaches to avoid the repetition of the Die() implementation besides several interfaces but I'm satisfied with this one.

Also, you may have noticed both Characters had the same Act() implementation, that was modified afterwards and moved to each different attack class, as well.

The following isn't related to the interfaces segregation principle but if you're curious about how the feature works entirely, this is the `Party` class:

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
		// Initialization and item assignment based on party type
        ...

		if (characterCore is IPartyCharacter character && Characters.Contains(character))
		{
			Characters.Remove(character);
		}
	}

	// Other methods
	...
}
```