import { createClient } from "@vercel/postgres";
import express, { Request, Response } from "express";
import { config } from "dotenv";
import { routerUser } from "./routers/user";
import { routerRecipe } from "./routers/recipes";
import { routerAuth } from "./routers/auth";

config();

const port = process.env.PORT || "3000"; // variabile di ambiente
const baseURL = "http://localhost";
const app = express(); // Crea un'applicazione Express
const server = express.json(); // Middleware per parsare i dati JSON
app.use(server);




const client = createClient({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

app.use('/users',routerUser);
app.use('/recipes',routerRecipe);
app.use('/auth', routerAuth);


app.listen(3000, () => {
  console.log("server is running in " + baseURL + port);
});
