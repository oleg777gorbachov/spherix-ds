import { Document } from "mongoose";

export interface logsI extends Document {
  gid: string;
  channelId: string;
  state: boolean;
  automodState: boolean;
}
