import { Schema, model } from "mongoose";
import { notificationI } from "../types";

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema(
  {
    gid: reqString,
    twitch: {
      type: Array,
    },
    youtube: {
      type: Array,
    },
    channelTwitch: reqString,
    channelYoutube: reqString,
    messageTwitch: reqString,
    messageYoutube: reqString,
    etags: {
      type: Array,
    },
    live: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

export default model<notificationI>("notification", schema);
