import express from "express";
import {
  deleteSong,
  getAllSongs,
} from "../../../controllers/songs/songsController";

const songsRouter = express.Router();

songsRouter.get("/", getAllSongs);
songsRouter.delete("/:id", deleteSong);

export default songsRouter;
