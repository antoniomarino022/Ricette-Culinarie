import { v4 as uuid } from "uuid";
export class Recipe {
  name: string;
  ingredients: Array<string>;
  idRecipe: string;

  constructor(name: string, ingredients: Array<string>) {
    this.name = name;
    this.ingredients = ingredients;
    this.idRecipe = uuid();
  }
}
