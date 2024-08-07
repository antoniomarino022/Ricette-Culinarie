import { Recipe } from "../models/Recipe";

export class RecipeController {
  recipes: Recipe[];

  constructor() {
    this.recipes = [];
  }

  createRecipe(name: string, ingredients: Array<string>) {
    const recipe = new Recipe(name, ingredients);
    this.recipes = [...this.recipes, recipe];
  }

  removeRecipe(idRecipe: number) {
    this.recipes = this.recipes.filter(
      (recipe) => idRecipe !== recipe.idRecipe
    );
  }

  updateRecipe(idRecipe: number) {}

  getRecipes() {}

  getFindRecipe() {}

  deleteRecipes(idRecipe: number) {}
}
