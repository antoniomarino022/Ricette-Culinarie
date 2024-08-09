
import { v4 as uuid } from "uuid";

export class User{
    username:string;
    email:string;
    password:string;
    idUser:string;

    constructor(username:string,email:string,password:string){
        this.username = username;
        this.email = email;
        this.password = password;
        this.idUser = uuid();
        this.token = uuid();
    }
}