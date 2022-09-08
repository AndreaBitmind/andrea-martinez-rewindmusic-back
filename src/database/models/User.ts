import { model, Schema } from "mongoose";

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
});

const User = model("User", userSchema, "users");

export default User;
