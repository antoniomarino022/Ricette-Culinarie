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
routerRecipe.get("", async (req: Request, res: Response) => {
  const recipes = await client.query(`SELECT * FROM recipes`);
  res.status(200).json(recipes.rows);
});

// add recipes
routerRecipe.post("/api/add/recipe",authenticateToken, (req: Request, res: Response) => {
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

// Update
routerRecipe.put('/api/recipe/update/:idRecipe',authenticateToken, async (req: Request, res: Response) => {
  const { idrecipe } = req.params; 
  const { name, ingredients } = req.body;

  if (!name || !ingredients) {
    return res
      .status(400)
      .json({ message: "Nome e ingredienti sono richiesti" });
  }

  try {
    
    const result = await client.query(
      `UPDATE recipes SET name = $1, ingredients = $2 WHERE id = $3 RETURNING *`,
      [name, ingredients, idrecipe]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Ricetta non trovata" });
    }

    return res.status(200).json({
      message: "Ricetta aggiornata con successo",
      ricetta: result.rows[0],
    });
  } catch (err) {
    console.error('Errore nel database:',err);
    return res.status(500).json({ error: 'Errore interno del server' });
  }
});

routerRecipe.delete('/api/recipe/delete:idRecipe',authenticateToken, async (req:Request,res:Response)=>{
  const { idrecipe } = req.params;

  const result = await client.query('DELETE FROM recipes WHERE idrecipe = $1',
    [idrecipe],
    (error,response)=>{
      if (error) {
        return res.status(500).json({ error });
      } else {
        return res.status(200).json({ message: "Prodotto rimosso dal carrello con successo" });
      }
    }
  );
})

