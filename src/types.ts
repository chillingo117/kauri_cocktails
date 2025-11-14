export interface CocktailOption {
  name: string;
  description?: string;
  price: number;
  ingredients: string[];
  drinkName?: string;
  finalDrink?: string;
  terminal?: boolean;
  isSpecial?: boolean;
  options?: Record<string, CocktailOption>;
}

export interface BaseSpirit {
  name: string;
  price: number;
  ingredients: string[];
  options: Record<string, CocktailOption>;
}

export interface MenuItem {
  name: string;
  flavorText: string;
  description: string;
  price: number;
  path: string[] | null;
  ingredients: string[];
}

export interface NamedDrink {
  name: string;
  path: string[];
}

export interface CocktailData {
  baseSpirits: Record<string, BaseSpirit>;
  namedDrinks: NamedDrink[];
  menuItems: MenuItem[];
}

export interface BuilderState {
  spirit: string;
  path: string[];
  currentName: string;
  ingredients: string[];
  totalPrice: number;
}
