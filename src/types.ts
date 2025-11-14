export interface CocktailOption {
  name: string;
  description?: string;
  ingredients: string[];
  drinkName?: string;
  finalDrink?: string;
  isSpecial?: boolean;
  knownName?: boolean;
  specialDrink?: boolean;
  options?: Record<string, CocktailOption>;
}

export interface BaseSpirit {
  name: string;
  ingredients: string[];
  options: Record<string, CocktailOption>;
}

export interface MenuItem {
  name: string;
  flavorText: string;
  description: string;
  path: string[] | null;
  category?: string;
  ingredients: string[];
}

export interface CocktailData {
  baseSpirits: Record<string, BaseSpirit>;
  menuItems: MenuItem[];
}

export interface BuilderState {
  spirit: string;
  path: string[];
  currentName: string;
  ingredients: string[];
}
