import { createClient } from "@vercel/postgres";
import express, { Response, Request } from "express";
import { config } from "dotenv";

import {
  generateAccessToken,
  authenticateToken,
} from "../middleware/authenticateToken";

config();

const client = createClient({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export const routerUser = express.Router();

routerUser.get("", async (req: Request, res: Response) => {
  const users = await client.query(`SELECT * FROM users`);
  res.status(200).json(users.rows);
});

routerUser.post("", (req: Request, res: Response) => {});
