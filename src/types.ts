export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Ingredient = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};

export type CookSettings = {
  temperature: number;
  speed: number;
};

export type RecipeStep = {
  id: string;
  description: string;
  type: 'cooking' | 'instruction';
  durationMinutes: number;
  cookingSettings?: CookSettings; // required only for cooking
  ingredientIds?: string[]; // only for instruction steps
};

export type Recipe = {
  id: string;
  title: string;
  difficulty: Difficulty;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
};
