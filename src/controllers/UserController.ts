import { User } from "../models/User";

export class UserController{
   private users:User[];

    constructor(){
        this.users = []
    }

    getUserToken(token:string):boolean{

        const auth = this.users.find((user)=>token === user.token);

        if(!auth){
            console.log('token non valido')
            return false
        }else return true
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

    loginUser(username:string,password:string){

        const user = this.users.find((user)=> username && password === user.username && user.password);

        if(!user){
            console.log('credenziali errate');
            return false
        }else{
            console.log('login effettuato con successo');
            return user.token
        }
        
    }

    logoutUser(token:string,idUser:string){

        const auth = this.getUserToken(token);

        if(!auth){
            console.log('token non valido');
            return false
        }else{
            this.users = this.users.filter((user)=> idUser !== user.idUser);
            console.log('logout effettuato con successo');
            return true
        }
    }

}