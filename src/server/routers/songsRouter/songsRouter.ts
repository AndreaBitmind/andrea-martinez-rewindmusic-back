import express from "express";
import {
  deleteSong,
  getAllSongs,
  getById,
} from "../../../controllers/songs/songsController";

const songsRouter = express.Router();

songsRouter.get("/", getAllSongs);
songsRouter.delete("/:id", deleteSong);
songsRouter.get("/:id", getById);

export default songsRouter;
