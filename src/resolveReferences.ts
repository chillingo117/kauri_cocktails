/**
 * Resolves _ref references in the cocktail data structure
 *
 * Usage:
 * import cocktailData from './cocktailData.json';
 * const resolved = resolveReferences(cocktailData);
 */

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

interface ReferenceObject extends JsonObject {
  _ref?: string;
  _drinkNameTemplate?: string;
}

/**
 * Gets a value from an object using a dot-notation path
 * e.g., "commonOptions.mixers" -> data.commonOptions.mixers
 */
function getByPath(obj: JsonObject, path: string): JsonValue {
  const keys = path.split('.');
  let current: JsonValue = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && !Array.isArray(current)) {
      current = current[key];
    } else {
      throw new Error(`Cannot resolve path: ${path}`);
    }
  }

  return current;
}

/**
 * Deep clones a JSON-serializable object
 */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Resolves all _ref references in the data structure
 */
export function resolveReferences(data: JsonObject): JsonObject {
  const rootData = deepClone(data);

  function resolve(obj: JsonValue, context: JsonObject = rootData): JsonValue {
    // Handle null, primitive types
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => resolve(item, context));
    }

    // Handle objects with _ref
    const refObj = obj as ReferenceObject;
    if (refObj._ref) {
      // Get the referenced object
      const referenced = getByPath(context, refObj._ref);

      if (typeof referenced !== 'object' || referenced === null || Array.isArray(referenced)) {
        throw new Error(`Reference ${refObj._ref} does not point to an object`);
      }

      // Clone the referenced object
      const referencedObj = deepClone(referenced) as JsonObject;

      // Handle _drinkNameTemplate for mixer options
      if (refObj._drinkNameTemplate && typeof referencedObj === 'object') {
        const template = refObj._drinkNameTemplate;
        const resolvedMixers: JsonObject = {};

        // Iterate through each mixer option
        for (const [mixerKey, mixerValue] of Object.entries(referencedObj)) {
          if (typeof mixerValue === 'object' && mixerValue !== null && !Array.isArray(mixerValue)) {
            const mixerObj = deepClone(mixerValue) as JsonObject;
            // Generate drink name from template
            const mixerName = mixerKey.charAt(0).toUpperCase() + mixerKey.slice(1);
            mixerObj.drinkName = template.replace('{mixer}', mixerName);
            resolvedMixers[mixerKey] = resolve(mixerObj, context);
          } else {
            resolvedMixers[mixerKey] = mixerValue;
          }
        }

        // Merge with any other properties (excluding _ref and _drinkNameTemplate)
        const { _ref: _, _drinkNameTemplate: __, ...overrides } = refObj;
        return {
          ...resolvedMixers,
          ...resolve(overrides as JsonObject, context)
        };
      }

      // Normal reference resolution: merge referenced object with overrides
      const { _ref: _, ...overrides } = refObj;
      const merged = {
        ...referencedObj,
        ...overrides
      };

      // Recursively resolve the merged object
      return resolve(merged, context);
    }

    // Regular object: recursively resolve all properties
    const resolved: JsonObject = {};
    for (const [key, value] of Object.entries(refObj)) {
      resolved[key] = resolve(value, context);
    }

    return resolved;
  }

  return resolve(rootData, rootData) as JsonObject;
}

/**
 * Resolves references and returns the full data structure
 * This is the main export you'll use in your application
 */
export function getCocktailData(rawData: JsonObject): JsonObject {
  const resolved = resolveReferences(rawData);

  // Remove the template sections from the final output
  const { commonOptions, liqueurs, ...rest } = resolved;

  return rest;
}

export default resolveReferences;
