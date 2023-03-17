import { Schema, model } from "mongoose";
import { modChannelI } from "../types";

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema(
  {
    gid: reqString,
    channelId: reqString,
    messageId: reqString,
  },
  {
    timestamps: true,
  }
);

export default model<modChannelI>("mod-channel", schema);
