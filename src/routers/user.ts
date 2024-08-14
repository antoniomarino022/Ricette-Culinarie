import { createClient } from "@vercel/postgres";
import express, { Response, Request, response } from "express";
import { config } from "dotenv";
import * as bcrypt from 'bcrypt';


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

// register user
routerUser.post("/register", async (req: Request, res: Response) => {

  const { username,email,password} = req.body
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password,salt);

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, Email e password sono richiesti" });
  }

    client.query('INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING *',
    [username,email,passwordHash],
    (error,result)=>{
      if(error){
        res.status(400).json({
          "message":error.message
        })
      }else{
        res.status(200).json({
          message: "registered with success"
        })
      }
    }
   )
});



