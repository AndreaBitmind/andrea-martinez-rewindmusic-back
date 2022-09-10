import { model, Schema } from "mongoose";

const songSchema = new Schema({
  songName: {
    type: String,
    required: true,
  },

  album: {
    type: String,
    required: true,
  },

  year: {
    type: String,
    required: true,
  },

  band: {
    type: String,
    required: true,
  },

  firstInstrument: {
    type: String,
  },

  secondInstrument: {
    type: String,
  },

  image: {
    type: String,
  },

  embeded: {
    type: String,
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  imageBackUp: {
    type: String,
  },
});

const Song = model("Song", songSchema, "songs");

export default Song;
