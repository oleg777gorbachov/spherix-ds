import { reminderI } from "./../types";
import { Schema, model } from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema(
  {
    uid: reqString,
    message: reqString,
    expires: {
      type: Number,
      required: true,
    },
    id: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default model<reminderI>("reminds", schema);
