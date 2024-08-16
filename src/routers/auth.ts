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

export const routerAuth = express.Router();

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
      res.status(201).json({ message: "Utente registrato con successo" });
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
    console.log(result);
    // Fino a qua la query viene eseguita
    const match = await bcrypt.compare(password, result.rows[0].password);
    if (result.rowCount! > 0 && match) {
      console.log(match); // true
      // si spacca qua
      const token = generateAccessToken("user1234");
      res
        .status(201)
        .json({ message: "Login effettuato successo", token: token });
    } else {
      res.status(401).json({ message: "Login fallito" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Errore nel server", error });
  }
});
