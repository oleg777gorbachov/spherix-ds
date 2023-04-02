import { ignoreDMI } from "./../types";
import { Schema, model } from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema({
  uid: reqString,
  gids: {
    type: Array,
    default: [],
  },
  isAll: {
    type: Boolean,
    default: false,
  },
});

export default model<ignoreDMI>("ignore", schema);
