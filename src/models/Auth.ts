import { v4 as uuid } from "uuid";
import { User } from "./User";

export class Auth {
    idUser: User["idUser"];
    token: string;
  
    constructor(idUser: string) {
      this.idUser = idUser;
      this.token = jwt.sign({ foo: "bar" }, "privateKey", {
        expiresIn: "1h",
      });
    }
  }