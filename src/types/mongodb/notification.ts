import { Document } from "mongoose";

export interface notificationI extends Document {
  gid: string;
  channelTwitch: string;
  channelYoutube: string;
  twitch: string[];
  youtube: string[];
  messageTwitch: string;
  messageYoutube: string;
  etags: string[];
  live: string[];
}
