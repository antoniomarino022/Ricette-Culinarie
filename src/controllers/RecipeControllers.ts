import { Recipe } from "../models/Recipe";

export class RecipeController {
    recipes:Recipe[];

    constructor(){
        this.recipes = []
    }

}