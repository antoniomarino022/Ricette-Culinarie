import { createClient } from "@vercel/postgres";
import express, { Response, Request, query, response } from "express";
import { config } from "dotenv";
import { authenticateToken, JwtRequest } from "../middleware/authenticateToken";
export const routerRecipe = express.Router();

config();

const client = createClient({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

// get recipes
routerRecipe.get("", authenticateToken, async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token mancante" });
  }

  const recipes = await client.query(`SELECT * FROM recipes `);
  res.status(200).json(recipes.rows);
});

// add recipes
routerRecipe.post(
  "/add",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Token mancante" });
      }

      const { name, ingredients } = req.body;

      if (!name || !ingredients) {
        return res
          .status(400)
          .json({ message: "Nome e ingredienti sono richiesti" });
      }

      const verify = await client.query(
        "SELECT * FROM recipes WHERE name = $1 AND ingredients = $2",
        [name, ingredients]
      );

      if (verify.rowCount && verify.rowCount > 0) {
        return res.status(400).json({ message: "Ricetta già esistente" });
      } else {
        const result = await client.query(
          `INSERT INTO recipes (name, ingredients) VALUES ($1, $2) RETURNING *`,
          [name, ingredients]
        );

        if (result.rowCount && result.rowCount > 0) {
          return res
            .status(200)
            .json({
              message: "Ricetta aggiunta con successo",
              recipe: result.rows[0],
            });
        } else {
          return res.status(400).json({ message: "Ricetta non aggiunta" });
        }
      }
    } catch (error) {
      return res.status(500).json({ message: "Errore del server", error });
    }
  }
);

// update recipe
routerRecipe.put(
  "/:idrecipe",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Token mancante" });
      }

      const { idrecipe } = req.params;
      const { name, ingredients } = req.body;

      if (!name || !ingredients) {
        return res
          .status(400)
          .json({ message: "Nome e ingredienti sono richiesti" });
      }

      const verify = await client.query(
        "SELECT * FROM recipes WHERE idrecipe = $1",
        [idrecipe]
      );

      if (verify.rowCount === 0) {
        return res.status(404).json({ message: "Ricetta non esistente" });
      } else {
        const result = await client.query(
          `UPDATE recipes SET name = $1, ingredients = $2 WHERE idrecipe = $3 RETURNING *`,
          [name, ingredients, idrecipe]
        );

        if (result.rowCount === 0) {
          return res.status(404).json({ message: "Ricetta non trovata" });
        }

        return res.status(200).json({
          message: "Ricetta aggiornata con successo",
          ricetta: result.rows[0],
        });
      }
    } catch (err) {
      return res.status(500).json({ error: "Errore interno del server" });
    }
  }
);

routerRecipe.delete(
  "/:idrecipe",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { idrecipe } = req.params;
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Token mancante" });
      }

      const verify = await client.query(
        "SELECT * FROM recipes WHERE idrecipe = $1",
        [idrecipe]
      );
      if (verify.rowCount === 0) {
        return res.status(404).json({ message: "Ricetta non esistente" });
      }

      const result = await client.query(
        "DELETE FROM recipes WHERE idrecipe = $1 RETURNING *",
        [idrecipe]
      );
      if(result.rowCount===0)
      {
        return res.status(500).json({ error: "Errore eliminazione ricetta" });
      }
      return res.status(200).json({
        message: "Ricetta eliminata con successo",
        ricetta: result.rows[0],
      });
    } catch (error) {
      return res.status(500).json({ error: "Errore interno del server" });
    }
  }
);
