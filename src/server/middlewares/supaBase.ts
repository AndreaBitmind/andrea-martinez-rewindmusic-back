import { createClient } from "@supabase/supabase-js";
import { NextFunction, Request, Response } from "express";
import { readFile } from "fs/promises";
import path from "path";
import CustomError from "../../utils/CustomError";

const supabase = createClient(
  "https://lfviceopjnwwbtpsihzh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdmljZW9wam53d2J0cHNpaHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI4MjMzMzAsImV4cCI6MTk3ODM5OTMzMH0.che_MtZAByN0wMEoOlYgr_-z5a9eSW6zfi0gWVcos6I"
);

const supaBaseUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { image } = req.body;
  const imagePath = path.join("uploads", image);

  try {
    const fileData = await readFile(imagePath);

    const storage = supabase.storage.from("Rewindmusic");

    const uploadResult = await storage.upload(image, fileData);

    if (uploadResult.error) {
      next(uploadResult.error);
      return;
    }
    const { publicURL } = storage.getPublicUrl(image);

    req.body.imageBackUp = publicURL;
    next();
  } catch (error) {
    const newError = new CustomError(
      500,
      "Couldn't upload or read the image",
      "Error while reading and uploading the image"
    );
    next(newError);
  }
};

export default supaBaseUpload;
