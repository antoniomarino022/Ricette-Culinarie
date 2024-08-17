import { createClient } from "@vercel/postgres";
import express, { Response, Request, response } from "express";
import { config } from "dotenv";
import * as bcrypt from "bcrypt";

import {
  generateAccessToken,
  authenticateToken,
} from "../middleware/authenticateToken";
import { User } from "../models/User";

config();

const client = createClient({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export const routerAuth = express.Router();

routerAuth.get("", async (req: Request, res: Response) => {
  const users = await client.query(`SELECT * FROM auth`);
  return res.status(200).json(users.rows);
});




// register user
routerAuth.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, Email e password sono richiesti" });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await client.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, passwordHash]
    );

    if (result.rowCount! > 0) {
      const user = result.rows[0]
      res.status(201).json({ message: "Utente registrato con successo",'user':user });
    } else {
      res.status(400).json({ message: "Registrazione fallita, riprova" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Errore nel server", error });
  }
});

// login user
routerAuth.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email e password sono richiesti" });
    }

    const result = await client.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Email o password non corretti" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const userId = user.id; 
      const token = generateAccessToken(userId);
      console.log(token)
      const success = await client.query('INSERT INTO auth (referencekeyuser, token) VALUES ($1,$2) RETURNING *',
        [user.id,token]
      );
      if(success.rowCount && success.rowCount > 0){
        return res
        .status(201)
        .json({ message: "Login effettuato con successo", token: token });
      }
      return res.status(500).json({message:'errore'})
    }
       else {
        return res.status(401).json({ message: "Email o password non corretti" });
      }
     
   
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Errore nel server", error });
  }
});


routerAuth.delete('/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ 'message': 'Token mancante' });
    }

    const result = await client.query('DELETE FROM auth WHERE token = $1 RETURNING *', [token]);

    if (result.rowCount && result.rowCount > 0) {
      res.status(200).json({ 'message': 'Logout effettuato con successo' });
    } else {
      res.status(400).json({ 'message': 'Logout non effettuato, token non trovato' });
    }
  } catch (error) {
    res.status(500).json({ 'message': 'Errore interno del server', error });
  }
});