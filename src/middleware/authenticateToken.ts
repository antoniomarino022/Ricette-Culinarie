import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export interface JwtRequest extends Request {
  user?: Object;
}

export const authenticateToken = (
  req: JwtRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.sendStatus(401).json({ message: "Token NON VALIDO" });

  jwt.verify(token, process.env.TOKEN_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export const generateAccessToken = (userId: string) => {
 
  const payload = { id: userId };
  return jwt.sign(payload, process.env.TOKEN_SECRET!, { expiresIn: "1800s" });
};
