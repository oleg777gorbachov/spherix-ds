import { automodI } from "./../types";
import { Schema, model } from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema({
  gid: reqString,
  state: { type: Boolean, default: true },
  spam: { type: Boolean, default: true },
  badwords: { type: Boolean, default: true },
  duplicateText: { type: Boolean, default: true },
  invites: { type: Boolean, default: true },
  links: { type: Boolean, default: true },
  caps: { type: Boolean, default: true },
  emoji: { type: Boolean, default: true },
  mention: { type: Boolean, default: true },
  whitelist: {
    type: Array,
    required: true,
  },
  words: {
    type: Array,
    required: true,
  },
  whitelistlinks: {
    type: Array,
    required: true,
  },
  maxEmoji: {
    type: Number,
    default: 5,
  },
});

export default model<automodI>("automod", schema);
