import { NextFunction, Request, Response } from "express";
import Song from "../../database/models/Song";
import CustomError from "../../utils/CustomError";

export const getAllSongs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const songs = await Song.find();

    if (songs.length === 0) {
      res.status(404).json({ songs: "No songs found" });
      return;
    }

    res.status(200).json({ songs });
  } catch (error) {
    const newError = new CustomError(
      404,
      "Error while getting songs",
      "No songs found"
    );

    next(newError);
  }
};

export const deleteSong = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deleteSongItem = await Song.findByIdAndDelete(id);
    if (deleteSongItem) {
      res.status(200).json({ message: "Song deleted correctly" });
    }
  } catch (error) {
    const newError = new CustomError(
      400,
      "Error while deleting song",
      "Error while deleting song"
    );
    next(newError);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);

    res.status(200).json({ song });
  } catch {
    next(
      new CustomError(404, "Element not found", "Can't response this request")
    );
  }
};

export const createSong = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const song = req.body;
  try {
    const songCreated = await Song.create(song);
    res.status(201).json({ songCreated });
  } catch (error) {
    const newError = new CustomError(
      400,
      "error creating a song",
      "Cannot create the song"
    );

    next(newError);
  }
};
