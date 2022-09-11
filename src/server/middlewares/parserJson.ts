import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import CustomError from "../../utils/CustomError";

const parserJson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newSong = req.body;

    const songObject = await JSON.parse(newSong);

    const newName = `${Date.now()}${req.file.originalname}`;
    songObject.image = newName;

    await fs.rename(
      path.join("uploads", req.file.filename),
      path.join("uploads", newName)
    );

    req.body = songObject;

    next();
  } catch (error) {
    const newError = new CustomError(404, "Missing data", "Missing data");
    next(newError);
  }
};

export default parserJson;
