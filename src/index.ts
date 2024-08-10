import { createClient } from "@vercel/postgres";
import express, { Request, Response } from "express";
import { config } from "dotenv";
import { routerUser } from "./routers/user";
import { routerRecipe } from "./routers/recipes";
config();

const port = process.env.PORT || "3000"; // variabile di ambiente
const baseURL = "http://localhost";
const app = express(); // Crea un'applicazione Express
const server = express.json(); // Middleware per parsare i dati JSON
// const myApp = new Marketplace()
app.use(server);

const client = createClient({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

// get recipes
// app.get("/api/recipes", async (req: Request, res: Response) => {
//   const recipes = await client.query(`SELECT * FROM recipes`);
//   res.status(200).json(recipes.rows);
// });

// add recipes
// app.post("/api/recipes", (req: Request, res: Response) => {
//   const { name, ingredients } = req.body;

//   // Verifica che `name` e `ingredients` siano presenti
//   if (!name || !ingredients) {
//     return res
//       .status(400)
//       .json({ message: "Nome e ingredienti sono richiesti" });
//   }

//   // Query per inserire i dati nella tabella `recipes`
//   client.query(
//     `INSERT INTO recipes (name, ingredients) VALUES ($1, $2) RETURNING *`,
//     [name, ingredients],
//     (err, result) => {
//       if (err) {
//         return res.status(400).json({ error: err.message });
//       }
//       return res.status(201).json({
//         message: "Ricetta aggiunta con successo",
//         ricetta: result.rows[0],
//       });
//     }
//   );
// });

app.listen(3000, () => {
  console.log("server is running in " + baseURL + port);
});
