export class Recipe{

    name:string;
    ingredients:Array<string>
    IdRecipe:number;

    constructor(name:string){
        this.name = name
        this.ingredients = [];
        this.IdRecipe = Math.random()
    }

}