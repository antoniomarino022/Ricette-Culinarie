
import { v4 as uuid } from "uuid";

export class User{
    username:string;
    email:string;
    password:string;
    primaryKeyUser:string;

    constructor(username:string,email:string,password:string){
        this.username = username;
        this.email = email;
        this.password = password;
        this.primaryKeyUser = uuid();
    }
}