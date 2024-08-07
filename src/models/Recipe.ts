export class Recipe {
  name: string;
  ingredients: Array<string>;
  idRecipe: number;

  constructor(name: string, ingredients: Array<string>) {
    this.name = name;
    this.ingredients = ingredients;
    this.idRecipe = Math.random();
  }
}
