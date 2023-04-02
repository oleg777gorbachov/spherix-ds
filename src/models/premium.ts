import { Schema, model } from "mongoose";
import { premiumI } from "../types";

const schema = new Schema(
  {
    gid: {
      type: String,
      requred: true,
    },
    state: {
      type: Boolean,
      required: true,
      default: false,
    },
    lastBuy: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<premiumI>("premium", schema);
