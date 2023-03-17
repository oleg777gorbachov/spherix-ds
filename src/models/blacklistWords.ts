import { Schema, model } from "mongoose";
import { blacklistI } from "../types";

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema({
  gid: reqString,
  whitelist: {
    type: Array,
    required: true,
  },
  words: {
    type: Array,
    required: true,
  },
});

export default model<blacklistI>("blacklist-words", schema);
