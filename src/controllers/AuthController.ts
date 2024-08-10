import { Auth } from "../models/Auth";
import { UserController } from "./UserController";

export class AuthController {
    private auths: Auth[];
    private userControllers: UserController;
    
    constructor(userController: UserController) {
        this.auths = [];
        this.userControllers = userController;
    }

    loginUser(email: string, password: string) {
        const user = this.userControllers.getAllUsers().find((user) => email === user.email && password === user.password);

        if (!user) {
            console.log('Credenziali errate');
            return false;
        } else {
            console.log('Login effettuato con successo');
            const newAuth = new Auth(user.primaryKeyUser);
            this.auths.push(newAuth); // Usa push per aggiungere direttamente l'autenticazione
            return true;
        }
    }

    getALLAuths() {
        return this.auths;
    }

    getAuth(token: string, idUser: string) {
        return this.auths.find((auth) => token === auth.token && idUser === auth.idUser);
    }

    logoutUser(token: string, idUser: string) {
        const auth = this.auths.find((auth) => token === auth.token && idUser === auth.idUser);

        if (!auth) {
            console.log('Token non valido');
            return false;
        } else {
            this.auths = this.auths.filter((auth) => token !== auth.token); // Rimuove correttamente l'autenticazione dell'utente disconnesso
            console.log('Logout effettuato con successo');
            return true;
        }
    }

    isValidToken(token: string, idUser: string) {
        const authFound = this.auths.find((auth) => token === auth.token && idUser === auth.idUser);  
        return !!authFound;
    }

    logAllUsers() {
        console.log("Tutte le autenticazioni:", JSON.stringify(this.getALLAuths(), null, 2));
    }
}
