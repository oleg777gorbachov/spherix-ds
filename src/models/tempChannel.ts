import { Schema, model } from "mongoose";
import { tempChannelI } from "../types";

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema(
  {
    gid: reqString,
    channelId: reqString,
  },
  {
    timestamps: true,
  }
);

export default model<tempChannelI>("temp-channel", schema);
