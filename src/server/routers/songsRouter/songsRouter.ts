import express from "express";
import multer from "multer";
import {
  createSong,
  deleteSong,
  getAllSongs,
  getById,
  modifySong,
} from "../../../controllers/songs/songsController";
import { authentication } from "../../middlewares/authentication";
import parserJson from "../../middlewares/parserJson";
import supaBaseUpload from "../../middlewares/supaBase";

const songsRouter = express.Router();
const upload = multer({ dest: "uploads" });

songsRouter.get("/", getAllSongs);
songsRouter.delete("/:id", deleteSong);
songsRouter.get("/:id", authentication, getById);
songsRouter.post(
  "/",
  upload.single("image"),
  parserJson,
  supaBaseUpload,
  createSong
);
songsRouter.put("/:id", modifySong);


export default songsRouter;
