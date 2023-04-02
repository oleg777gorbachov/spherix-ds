import { warnI } from "./../types";
import { Schema, model } from "mongoose";

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
    id: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

export default model<warnI>("warns", schema);
