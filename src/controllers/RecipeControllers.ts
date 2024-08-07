import { Recipe } from "../models/Recipe";

export class RecipeController {
  private recipes: Recipe[];

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

  updateRecipe(idRecipe:number,name:string,ingredients:Array<string>) {
    this.recipes = this.recipes.map((recipe)=>{
        if(recipe.idRecipe === idRecipe){
          recipe = {...recipe,name,ingredients};
        }
        return recipe
    })
  }

  getRecipes() {
    return this.recipes;
  }

  getRecipe(idRecipe:number) {
    return this.recipes.find((recipe)=>recipe.idRecipe===idRecipe);
  }

  deleteRecipes() {
    this.recipes = [];
  }
}
