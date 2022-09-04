import express from "express";
import getAllSongs from "../../../controllers/songs/songsController";

const songsRouter = express.Router();

songsRouter.get("/", getAllSongs);

export default songsRouter;
