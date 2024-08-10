import { UserController } from "./controllers/UserController";
import { RecipeController } from "./controllers/RecipeController";

const userController = new UserController();
const recipeController = new RecipeController(userController);

userController.registerUser("john_doe", "john@example.com", "password123");


const loginSuccess = userController.authControllers.loginUser("john@example.com", "password123");

if (loginSuccess) {
    
    const user = userController.getAllUsers().at(0)!;
    const auth = userController.authControllers.getALLAuths().at(0)!;

    
    recipeController.createRecipe(auth.token, user.primaryKeyUser, "Torta", ["farina", "uova"]);


    console.log("Ricette dopo creazione:", recipeController.getRecipes());

    recipeController.removeRecipe(recipeController.getRecipes().at(0)?.idRecipe!, auth.token, user.primaryKeyUser);

    
    userController.authControllers.logoutUser(auth.token, user.primaryKeyUser);

    console.log("Ricette dopo rimozione:", recipeController.getRecipes());
} else {
    console.log("Login fallito");
}
