import { Recipe } from "../models/Recipe";
import { AuthController } from "./AuthController";
import { UserController } from "./UserController";

export class RecipeController {
    private recipes: Recipe[];
    private userController: UserController;
    private authController: AuthController;
    
    constructor(userController: UserController) {
        this.recipes = [];
        this.userController = userController;
        this.authController = new AuthController(userController); // Passa correttamente il UserController
    }

    createRecipe(token: string, idUser: string, name: string, ingredients: Array<string>) {
        const auth = this.authController.isValidToken(token, idUser);

        if (!auth) {
            console.log('Utente non autenticato');
            return false;
        } else {
            const recipe = new Recipe(name, ingredients);
            this.recipes.push(recipe);
            return true;
        }
    }

    removeRecipe(idRecipe: string, token: string, idUser: string) {
        const auth = this.authController.isValidToken(token, idUser);

        if (!auth) {
            console.log('Utente non autenticato');
            return false;
        } else {
            this.recipes = this.recipes.filter((recipe) => idRecipe !== recipe.idRecipe);
            return true;
        }
    }

    updateRecipe(idRecipe: string, name: string, ingredients: Array<string>, token: string, idUser: string) {
        const auth = this.authController.isValidToken(token, idUser);

        if (!auth) {
            console.log('Utente non autenticato');
            return false;
        } else {
            this.recipes = this.recipes.map((recipe) => {
                if (recipe.idRecipe === idRecipe) {
                    return { ...recipe, name, ingredients };
                }
                return recipe;
            });
            return true;
        }
    }

    getRecipes() {
        return this.recipes;
    }

    getRecipe(idRecipe: string) {
        return this.recipes.find((recipe) => recipe.idRecipe === idRecipe);
    }

    deleteRecipes() {
        this.recipes = [];
    }
}
