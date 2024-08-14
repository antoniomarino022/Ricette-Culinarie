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

export const routerUser = express.Router();

routerUser.get("", async (req: Request, res: Response) => {
  const users = await client.query(`SELECT * FROM users`);
  res.status(200).json(users.rows);
});

// register user
routerUser.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, Email e password sono richiesti" });
  }

  client.query(
    "INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING *",
    [username, email, passwordHash],
    (error, result) => {
      // USARE TRY-CATCH
      if (error) {
        res.status(400).json({
          message: error.message,
        });
      } else {
        res.status(200).json({
          message: "registered with success",
        });
      }
    }
  );
});

routerUser.put("/:id", async (req: Request, res: Response) => {
  try {
    const idUser = req.params.id;
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    await client.connect();

    // if (!username || !password || !idUser) {
    //   res.status(400).json({ message: "Credenziali non valide!" });
    // }

    const result = await client.query(
      `UPDATE users
  SET username = $1, 
  password = $2
  WHERE id = $3`,
      [username, passwordHash, idUser]
    );

    // if (result.rows.length > 0) {
    //   return res.status(200).json({ message: "Credenziali aggiornate!" });
    // } else {
    //   return res.status(400).json({ message: "Credenziali non aggiornate!" });
    // }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  } finally {
    client.end();
  }
});
