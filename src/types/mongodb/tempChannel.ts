import { Document } from "mongoose";

export interface tempChannelI extends Document {
  gid: string;
  channelId: string;
}
