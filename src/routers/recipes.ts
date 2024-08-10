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
