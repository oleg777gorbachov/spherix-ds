import { Document } from "mongoose";

export interface modChannelI extends Document {
  gid: string;
  channelId: string;
  messageId: string;
}
