import { createClient } from "@vercel/postgres";
import express, { Response, Request, response } from "express";
import { config } from "dotenv";
import * as bcrypt from "bcrypt";

import {
  generateAccessToken,
  authenticateToken,
} from "../middleware/authenticateToken";

config();



const client = createClient({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export const routerUser = express.Router();

routerUser.get("", async (req: Request, res: Response) => {
  const users = await client.query(`SELECT * FROM users`);
  return res.status(200).json(users.rows);
});

// register user
routerUser.post("/register", async (req: Request, res: Response) => {
  
  try {
    const { username, email, password } = req.body;

  
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, Email e password sono richiesti" });
    }

    
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, passwordHash]
    );

    if (result.rowCount! > 0) {
      res.status(201).json({ message: "Utente registrato con successo"});
    } else {
      res.status(400).json({ message: "Registrazione fallita, riprova" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Errore nel server",error });
  }
});

routerUser.put("/:id", async (req: Request, res: Response) => {
  try {
    const idUser = req.params.id;
    const { username, password } = req.body;

    if (!username || !password || !idUser) {
      return res.status(400).json({ message: "Credenziali non valide!" });
    }

    
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await client.query(
      `UPDATE users
       SET username = $1, 
           password = $2
       WHERE id = $3
       RETURNING *`,
      [username, passwordHash, idUser]
    );

    
    if (result.rows.length > 0) {
      return res.status(200).json({ message: "Credenziali aggiornate!", user: result.rows[0] });
    } else {
      return res.status(400).json({ message: "Credenziali non aggiornate!" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Errore interno del server",error });

  }
});

routerUser.delete("/:id", async (req: Request, res: Response) => {
  const { password } = req.body;
  if(!password) return res.status(404).json({message: "Missing password"});
  try {
    const idUser = req.params.id;
    const verifyUser = await client.query(
      `SELECT * FROM users WHERE id = $1`,
      [idUser]
    );

    if(verifyUser.rowCount !== 0)
    {
      const match = await bcrypt.compare(password, verifyUser.rows[0].password);
      if(match)
      {
        const result = await client.query(
          `DELETE FROM users WHERE id=$1`,
          [idUser]
        );
        return res.status(200).json({message: "Utente eliminato con successo"});
      } 
      else
      {
        return res.status(400).json({message: "Password sbagliata"});
      }
    }
    return res.status(404).json({message: "Utente non trovato"}) 
  }
  catch(error){
    return res.status(500).json({ message: "Errore interno del server",error });   
  }
});