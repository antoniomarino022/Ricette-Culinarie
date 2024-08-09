import { RecipeController } from "./controllers/RecipeController";

const recipeController = new RecipeController();

recipeController.createRecipe("torta", ["cacca", "uova"]);

console.log(recipeController.getRecipes());

recipeController.removeRecipe(recipeController.getRecipes().at(0)?.idRecipe!);

console.log(recipeController.getRecipes());