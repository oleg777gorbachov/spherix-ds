import { Document } from "mongoose";

export interface welcomeI extends Document {
  gid: string;
  roleId?: string[];
  channelId?: string;
  message?: string;
  messageState: boolean;
}
