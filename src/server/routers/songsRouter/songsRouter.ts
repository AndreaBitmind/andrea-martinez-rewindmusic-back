import express from "express";
import {
  createSong,
  deleteSong,
  getAllSongs,
  getById,
} from "../../../controllers/songs/songsController";
import { authentication } from "../../middlewares/authentication";

const songsRouter = express.Router();

songsRouter.get("/", getAllSongs);
songsRouter.delete("/:id", deleteSong);
songsRouter.get("/:id", authentication, getById);
songsRouter.post("/", authentication, createSong);

export default songsRouter;
