# Cocktail Data Structure Guide

Your cocktail data has been refactored to be more maintainable! This guide explains how to work with the new structure.

## What Changed?

The `cocktailData.json` file now uses **references** to avoid repetition. Common options are defined once at the top and referenced throughout.

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
  }
}
```

## How References Work

Instead of copying the same option 4 times, you use `_ref`:

### Before (repetitive):
```json
"foamBitters": {
  "name": "Foam and Bitters",
  "description": "Egg white foam...",
  "price": 0.6,
  "ingredients": ["Egg White Foam", "Bitters"],
  "terminal": true
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
    "price": 0.6,
    "ingredients": ["Egg White Foam", "Bitters"],
    "terminal": true
  }
}

// Reference everywhere with overrides
"foamBitters": {
  "_ref": "commonOptions.foamBitters",
  "drinkName": "Gimlet"  // Override just the drink name
}
```

## Making Changes

### ✅ Change a Price
**Change in ONE place, affects everywhere:**
```json
"commonOptions": {
  "sodaWater": {
    "price": 0.5  // Change from 0.5 to 0.75
  }
}
```
This automatically updates: Tom Collins, Rum Collins, Whiskey Collins, Vodka Collins, and all Collins variations!

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
      "price": 1,
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
    "price": 2,
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

✅ **Single Source of Truth** - Update price once, changes everywhere
✅ **No Copy-Paste Errors** - Can't have different prices in different places
✅ **Easy to Add Content** - New mixer/liqueur available to all spirits instantly
✅ **Smaller File** - Less duplication = easier to read
✅ **Safe Refactoring** - Change common option, all drinks update consistently

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
    "price": 2,
    "ingredients": ["St-Germain"],
    "terminal": true,
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
  "options": {
    "sodaWater": {
      "_ref": "commonOptions.sodaWater",
      "drinkName": "Elderflower Collins"
    }
  }
}

// In vodka
"elderflower": {
  "_ref": "liqueurs.elderflower",
  "drinkName": "Vodka Elderflower"
}
```

3. **Add to namedDrinks:**
```json
{ "name": "Elderflower Gimlet", "path": ["gin", "sugarCitrus", "liqueur", "elderflower"] },
{ "name": "Vodka Elderflower", "path": ["vodka", "sugarCitrus", "liqueur", "elderflower"] }
```

Done! The liqueur definition is in one place, referenced everywhere.

---

**Questions?** The structure is designed to be intuitive - just follow the existing patterns!
