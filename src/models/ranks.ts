import { Schema, model } from "mongoose";
import { ranksI } from "../types";

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema(
  {
    voice: {
      type: Number,
      required: true,
    },
    messages: {
      type: Number,
      required: true,
    },
    messagesLength: {
      type: Number,
      required: true,
    },
    uid: reqString,
    gid: reqString,
  },
  {
    timestamps: true,
  }
);

export default model<ranksI>("ranks", schema);
