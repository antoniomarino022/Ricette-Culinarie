import { createClient } from "@vercel/postgres";
import express, { Response, Request, response } from "express";
import { config } from "dotenv";
import * as bcrypt from 'bcrypt';


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
  res.status(200).json(users.rows);
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

    if (result.rows.length > 0) {
      res.status(201).json({ message: "Utente registrato con successo"});
    } else {
      res.status(400).json({ message: "Registrazione fallita, riprova" });
    }
  } catch (error) {
    res.status(500).json({ message: "Errore nel server",error });
  }
});



