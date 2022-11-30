import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  isAdmin: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  empNo: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

export default model("user", UserSchema);
