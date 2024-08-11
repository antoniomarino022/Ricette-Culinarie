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

app.listen(3000, () => {
  console.log("server is running in " + baseURL + port);
});
