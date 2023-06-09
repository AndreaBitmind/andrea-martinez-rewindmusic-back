import "../loadEnvironment";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../interfaces/CustomJwtPayload";

const secretWord = process.env.SECRET;

export const hashCreator = (text: string) => {
  const salt = 10;
  return bcrypt.hash(text, salt);
};

export const createToken = (payload: CustomJwtPayload) =>
  jwt.sign(payload, secretWord);

export const hashCompare = (text: string, hash: string) =>
  bcrypt.compare(text, hash);

export const verifyToken = (token: string) => jwt.verify(token, secretWord);
