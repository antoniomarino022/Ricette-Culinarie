import { User } from "../models/User";
import { AuthController } from "./AuthController";

export class UserController{
   private users:User[];
    private authControllers:AuthController;
    constructor(){
        this.users = [];
        this.authControllers = new AuthController(this);
    }


    registerUser(username:string,email:string,password:string,idUser:string){

        const foundUser = this.users.find((user)=> email === user.idUser);

        if(!foundUser){
            console.log('utente non registrato');
            return false
        }else{
            const register = new User(username,email,password);
            this.users = [...this.users,register];
            return true
        }
     
        
    }
    updateUser(username:string, token:string, idUser:string)
    {
            if(this.authControllers.isValidToken(token,idUser))
            {
                this.users.map((user)=>
                {
                    if(idUser === user.idUser)
                    {
                        user = {...user, username}
                    }
                    return user;
                });
                console.log("Modifica username avvenuta");
                return true;
            }
            console.log("Token non valido");
            return false;
    }
    getUsers()
    {
        return this.users;
    }
   
}