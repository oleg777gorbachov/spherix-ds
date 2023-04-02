import { Document } from "mongoose";

export interface musicI extends Document {
  gid: string;
  voiceId: string;
  channelId: string;
  muteUsers: boolean;
}
