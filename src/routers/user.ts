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
