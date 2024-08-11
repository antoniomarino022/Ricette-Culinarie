import { createClient } from "@vercel/postgres";
import express, { Response, Request } from "express";
import { config } from "dotenv";
import { authenticateToken, JwtRequest } from "../middleware/authenticateToken";
export const routerRecipe = express.Router();

config();

const client = createClient({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

// get recipes
routerRecipe.get("", async (req: Request, res: Response) => {
  const recipes = await client.query(`SELECT * FROM recipes`);
  res.status(200).json(recipes.rows);
});

// add recipes
routerRecipe.post("", (req: Request, res: Response) => {
  const { name, ingredients } = req.body;

  // Verifica che `name` e `ingredients` siano presenti
  if (!name || !ingredients) {
    return res
      .status(400)
      .json({ message: "Nome e ingredienti sono richiesti" });
  }

  // Query per inserire i dati nella tabella `recipes`
  client.query(
    `INSERT INTO recipes (name, ingredients) VALUES ($1, $2) RETURNING *`,
    [name, ingredients],
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(201).json({
        message: "Ricetta aggiunta con successo",
        ricetta: result.rows[0],
      });
    }
  );
});
