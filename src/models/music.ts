import { Schema, model } from "mongoose";
import { musicI } from "../types";

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema({
  gid: reqString,
  voiceId: reqString,
  channelId: reqString,
  muteUsers: {
    type: Boolean,
    default: true,
  },
});

export default model<musicI>("music", schema);
