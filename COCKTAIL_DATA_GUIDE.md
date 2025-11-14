# Cocktail Data Structure Guide

Your cocktail data has been refactored to be more maintainable! This guide explains how to work with the new structure.

## What Changed?

The `cocktailData.json` file now uses:
1. **References** to avoid repetition - common options are defined once at the top and referenced throughout
2. **Self-contained drink metadata** - each drink now has `knownName` and `specialDrink` booleans directly in the data
3. **No separate arrays** - the `namedDrinks` array has been removed; the UI can determine if a drink is named by checking the `knownName` property directly
4. **Overridable metadata** - properties like `knownName` can be overridden per spirit (e.g., "Gin & Tonic" is known, but "Rum & Tonic" is not)

## File Structure

```json
{
  "commonOptions": {
    "mixers": { /* tonic, coke, lemonade */ },
    "foamBitters": { /* egg white foam option */ },
    "sodaWater": { /* collins option */ },
    "somethingElse": { /* generic liqueur */ }
  },
  "liqueurs": {
    "aperol": { /* ... */ },
    "midori": { /* ... */ },
    "violette": { /* ... */ },
    "mure": { /* ... */ },
    "cointreau": { /* ... */ }
  },
  "baseSpirits": {
    "gin": { /* uses _ref to reference common options */ }
  },
  "menuItems": [ /* featured drinks with full details */ ]
}
```

## Drink Metadata

Each drink option now includes metadata flags:

- **`drinkName`** (string, required): The name of the cocktail (e.g., "Gimlet", "Gin & Tonic")
- **`knownName`** (boolean, defaults to `false`): `true` if this is a well-known, classic cocktail name; `false` for made-up or generic names
- **`specialDrink`** (boolean, optional): `true` if this drink should be featured on the menu

**Note**: Since `knownName` defaults to `false`, you only need to specify it when it's `true`.

The UI determines if a drink is complete (has no more options) by checking if the `options` property is empty or undefined.

## How References Work

Instead of copying the same option 4 times, you use `_ref`:

### Before (repetitive):
```json
"foamBitters": {
  "name": "Foam and Bitters",
  "description": "Egg white foam...",
  "ingredients": ["Egg White Foam", "Bitters"]
}
```
Repeated in gin, rum, whiskey, vodka = 4 places to update!

### After (maintainable):
```json
// Define once in commonOptions
"commonOptions": {
  "foamBitters": {
    "name": "Foam and Bitters",
    "description": "Egg white foam...",
    "ingredients": ["Egg White Foam", "Bitters"]
  }
}

// Reference everywhere with overrides
"foamBitters": {
  "_ref": "commonOptions.foamBitters",
  "drinkName": "Gimlet",  // Override the drink name
  "knownName": true       // Add metadata
}
```

### Example with All Metadata:
```json
"sugarCitrus": {
  "name": "Begin a cocktail",
  "description": "A balanced base to start a cocktail",
  "ingredients": ["1/2. Sugar Syrup", "3/4. Lemon"],
  "drinkName": "Gimlet",
  "knownName": true,      // This is a famous cocktail
  "options": { /* ... */ }  // Has more options, not complete yet
}
```

### Example with Overridable Mixer Metadata:
```json
"mixer": {
  "name": "Top with mixer",
  "description": "Simple and refreshing",
  "ingredients": [],
  "options": {
    "_ref": "commonOptions.mixers",
    "_drinkNameTemplate": "Gin & {mixer}",
    "tonic": {
      "knownName": true    // "Gin & Tonic" is a known drink
    }
    // coke, lemonade, soda inherit knownName: false (default)
  }
}
```

This allows different spirits to have different `knownName` values for the same mixer. For example:
- **Gin**: Only tonic is known → "Gin & Tonic" (`true`)
- **Rum**: Only coke is known → "Rum & Coke" (`true`)
- **Whiskey**: Only coke is known → "Whiskey & Coke" (`true`)
- **Vodka**: Both tonic and coke are known → "Vodka & Tonic" and "Vodka Coke" (`true`)

All other combinations default to `false` and don't need to be specified.

## Making Changes

### ✅ Add a New Mixer
```json
"commonOptions": {
  "mixers": {
    "tonic": { /* ... */ },
    "coke": { /* ... */ },
    "lemonade": { /* ... */ },
    "sprite": {  // NEW!
      "name": "Sprite",
      "description": "Lemon-lime and bubbly",
      "ingredients": ["Sprite"],
      "terminal": true
    }
  }
}
```
Instantly available for all 4 spirits! No need to edit gin, rum, whiskey, vodka separately.

### ✅ Add a New Liqueur
```json
"liqueurs": {
  "aperol": { /* ... */ },
  "chambord": {  // NEW!
    "name": "Chambord",
    "description": "Raspberry liqueur",
    "ingredients": ["Chambord"],
    "terminal": true,
    "isSpecial": true
  }
}
```

Then reference it in the spirit you want:
```json
"vodka": {
  "sugarCitrus": {
    "liqueur": {
      "options": {
        "chambord": {
          "_ref": "liqueurs.chambord",
          "drinkName": "Raspberry Vodka Sour"
        }
      }
    }
  }
}
```

### ✅ Update a Description
Change "Egg white foam for a silky smooth top" once in `commonOptions.foamBitters`, and it updates for Gimlet, Daiquiri, Whiskey Sour, and Vodka Gimlet automatically.

## Special Features

### Mixer Templates
Mixers use `_drinkNameTemplate` to avoid repeating "Gin & Tonic", "Rum & Tonic", etc.:

```json
"mixer": {
  "options": {
    "_ref": "commonOptions.mixers",
    "_drinkNameTemplate": "Gin & {mixer}"
  }
}
```

This automatically generates:
- "Gin & Tonic"
- "Gin & Coke"
- "Gin & Lemonade"

## How It Works

The `resolveReferences.ts` file handles the magic:
1. Reads `cocktailData.json`
2. Finds all `_ref` entries
3. Copies the referenced data
4. Merges with any overrides (like `drinkName`)
5. Returns a fully expanded structure

Your React app uses this in `App.tsx`:
```tsx
import rawCocktailData from './cocktailData.json';
import { resolveReferences } from './resolveReferences';

const cocktailData = resolveReferences(rawCocktailData);
```

## Benefits

✅ **Single Source of Truth** - Update once, changes everywhere
✅ **No Copy-Paste Errors** - Can't have inconsistent definitions in different places
✅ **Easy to Add Content** - New mixer/liqueur available to all spirits instantly
✅ **Smaller File** - Less duplication = easier to read
✅ **Safe Refactoring** - Change common option, all drinks update consistently
✅ **Self-Documenting** - Each drink carries its own metadata (name, whether it's known, whether it's special)
✅ **No Separate Arrays** - The `namedDrinks` array has been eliminated; UI checks `knownName` directly
✅ **Flexible Overrides** - Each spirit can have different metadata for the same base option (e.g., Gin & Tonic vs Rum & Tonic)

## Backup

Your original file is saved as `cocktailData.backup.json` - keep it safe!

## Example: Adding a New Liqueur to All Spirits

Let's say you get Elderflower liqueur:

1. **Add to liqueurs section:**
```json
"liqueurs": {
  "elderflower": {
    "name": "Elderflower",
    "description": "Floral and sweet elderflower notes",
    "ingredients": ["St-Germain"],
    "isSpecial": true
  }
}
```

2. **Reference in each spirit's liqueur options:**
```json
// In gin
"elderflower": {
  "_ref": "liqueurs.elderflower",
  "drinkName": "Elderflower Gimlet",
  "knownName": false,  // Not a classic cocktail name
  "options": {
    "sodaWater": {
      "_ref": "commonOptions.sodaWater",
      "drinkName": "Elderflower Collins",
      "knownName": false
    }
  }
}

// In vodka
"elderflower": {
  "_ref": "liqueurs.elderflower",
  "drinkName": "Vodka Elderflower",
  "knownName": false
}
```

Done! The liqueur definition is in one place, referenced everywhere, and each drink carries its own metadata.

---

**Questions?** The structure is designed to be intuitive - just follow the existing patterns!
