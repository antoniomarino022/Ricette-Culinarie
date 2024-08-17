import { createClient } from "@vercel/postgres";
import express, { Response, Request, response } from "express";
import { config } from "dotenv";
import * as bcrypt from "bcrypt";
import { authenticateToken } from "../middleware/authenticateToken";

config();



const client = createClient({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export const routerUser = express.Router();

// get all users
routerUser.get("", async (req: Request, res: Response) => {
  const users = await client.query(`SELECT * FROM users`);
  return res.status(200).json(users.rows);
});


// get user
routerUser.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await client.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );

    if (result.rowCount !== 0) {
      res.status(200).json({ 'user': result.rows[0] });
    } else {
      
      res.status(400).json({ 'message': 'Utente non trovato' });
    }

  } catch (error) {
    return res.status(500).json({ message: "Errore interno del server", error });
  }
});


// update user
routerUser.put("/:id", async (req: Request, res: Response) => {
  try {
    const idUser = req.params.id;
    const { username, password, oldPassword } = req.body;

    if (!username || !password || !idUser || !oldPassword) {
      return res.status(400).json({ message: "Credenziali mancanti" });
    }

    const verify = await client.query("SELECT * FROM users WHERE username=$1", [
      username
    ]);

    if (verify.rowCount === 0) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    
    const salt = await bcrypt.genSalt();
    const match = await bcrypt.compare(oldPassword, verify.rows[0].password);
    if(match)
    {
      const passwordHash = await bcrypt.hash(password, salt);
      const result = await client.query(
        `UPDATE users
         SET username = $1, 
             password = $2
         WHERE id = $3
         RETURNING *`,
        [username, passwordHash, idUser]
      );
  
      
      if (result.rowCount && result.rowCount > 0) {
        return res.status(200).json({ message: "Credenziali aggiornate!", user: result.rows[0] });
      } else {
        return res.status(400).json({ message: "Credenziali non aggiornate!" });
      }
    }
    else
    {
      return res.status(401).json({ message: "Vecchia password sbagliata" });
    }
    
  } catch (error) {
    return res.status(500).json({ message: "Errore interno del server",error });

  }
});

// delete user
routerUser.delete("/:id", async (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password) return res.status(404).json({ message: "Missing password" });

  try {
    const idUser = req.params.id;

    const verifyUser = await client.query(
      `SELECT * FROM users WHERE id = $1`,
      [idUser]
    );

    if (verifyUser.rowCount !== 0) {
      const match = await bcrypt.compare(password, verifyUser.rows[0].password);

      if (match) {
        const result = await client.query(
          `DELETE FROM users WHERE id=$1`,
          [idUser]
        );

        if (result.rowCount && result.rowCount > 0) {
          return res.status(200).json({ message: "Utente eliminato con successo" });
        } else {
          return res.status(400).json({ message: "Eliminazione dell'utente fallita" });
        }
      } else {
        return res.status(400).json({ message: "Password sbagliata" });
      }
    } else {
      return res.status(404).json({ message: "Utente non trovato" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Errore interno del server", error });
  }
});


// clear table

routerUser.delete("", async (req: Request, res: Response) => {
  await client.query(`DELETE FROM users`);
  return res.status(200).json({message:"users svuotato con successo"});
});
