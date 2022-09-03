import { model, Schema } from "mongoose";

const songSchema = new Schema({
  SongName: {
    type: String,
    required: true,
  },

  Album: {
    type: String,
    required: true,
  },

  Year: {
    type: String,
    required: true,
  },

  Band: {
    type: String,
    required: true,
  },

  Instrument: {
    type: String,
    required: true,
  },

  Image: {
    type: String,
    required: true,
  },

  Embeded: {
    type: String,
    required: true,
  },

  Owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Song = model("Song", songSchema, "songs");

export default Song;
