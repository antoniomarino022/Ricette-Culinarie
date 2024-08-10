import { User } from "../models/User";
import { AuthController } from "./AuthController";

export class UserController {
    private users: User[];
   authControllers: AuthController;
    
    constructor() {
        this.users = [];
        this.authControllers = new AuthController(this);
    }

    registerUser(username: string, email: string, password: string) {
        const foundUser = this.users.find((user) => email === user.email && username === user.username);

        if (!!foundUser) {
            console.log('Utente già esistente');
            return false;
        } else {
            const register = new User(username, email, password);
            this.users.push(register);
            return true;
        }
    }

    updateUser(username: string, token: string, primaryKeyUser: string) {
        if (this.authControllers.isValidToken(token, primaryKeyUser)) {
            this.users = this.users.map((user) => {
                if (primaryKeyUser === user.primaryKeyUser) {
                    return { ...user, username };
                }
                return user;
            });
            console.log("Modifica username avvenuta");
            return true;
        }
        console.log("Token non valido");
        return false;
    }

    getAllUsers() {
        return this.users;
    }

    getUser(primaryKeyUser: string) {
        return this.users.find((user) => primaryKeyUser === user.primaryKeyUser);
    }

    logAllUsers() {
        console.log("Tutti gli utenti:", JSON.stringify(this.getAllUsers(), null, 2));
    }
}
