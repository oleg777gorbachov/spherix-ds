import { Schema, model } from "mongoose";
import { punishmentI } from "../types";

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema(
  {
    uid: reqString,
    gid: reqString,
    modId: reqString,
    reason: reqString,
    expires: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["ban", "mute", "timeout"],
    },
  },
  {
    timestamps: true,
  }
);

export default model<punishmentI>("punishment", schema);
