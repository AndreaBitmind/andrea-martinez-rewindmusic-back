import express from "express";
import multer from "multer";
import {
  createSong,
  deleteSong,
  getAllSongs,
  getById,
} from "../../../controllers/songs/songsController";
import { authentication } from "../../middlewares/authentication";
import supaBaseUpload from "../../middlewares/supaBase";

const upload = multer({ dest: "uploads" });
const songsRouter = express.Router();

songsRouter.get("/", getAllSongs);
songsRouter.delete("/:id", deleteSong);
songsRouter.get("/:id", authentication, getById);
songsRouter.post(
  "/",
  upload.single("image"),
  authentication,
  supaBaseUpload,
  createSong
);

export default songsRouter;
