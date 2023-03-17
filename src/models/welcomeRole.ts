import { Schema, model } from "mongoose";
import { welcomeI } from "../types";

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema(
  {
    gid: reqString,
    roleId: Array,
    channelId: String,
    message: String,
    messageState: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export default model<welcomeI>("start-role", schema);
