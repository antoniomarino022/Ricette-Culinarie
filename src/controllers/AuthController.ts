import { Auth } from "../models/Auth";
import { UserController } from "./UserController";

export class AuthController{
    private auths:Auth[];
    private userControllers:UserController;
     constructor(userController:UserController){
         this.auths = [];
         this.userControllers = userController;
     }
     loginUser(username:string,password:string){

        const user = this.userControllers.getUsers().find((user)=> username === user.username && password === user.password);

        if(!user){
            console.log('credenziali errate');
            return false;
        }else{
            console.log('login effettuato con successo');
            const newAuth = new Auth(user.idUser);
            this.auths = [...this.auths, newAuth];
            return true;
        }
        
    }

    logoutUser(token:string){

        const auth = this.auths.find((auth)=> token === auth.token);

        if(!auth){
            console.log('token non valido');
            return false
        }else{
            this.auths = this.auths.filter((auth)=> token === auth.token);
            console.log('logout effettuato con successo');
            return true;
        }
    }
    isValidToken(token:string, idUser:string)
    {
       const authFound = this.auths.find((auth)=> token === auth.token && idUser === auth.idUser);  
       return !!authFound;
    }

}