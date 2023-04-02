import { Schema, model } from "mongoose";
import { logsI } from "../types";

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema({
  gid: reqString,
  channelId: reqString,
  state: {
    type: Boolean,
    required: true,
    default: true,
  },
  automodState: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default model<logsI>("logs", schema);
