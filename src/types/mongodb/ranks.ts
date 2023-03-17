import { Document } from "mongoose";

export interface ranksI extends Document {
  voice: number;
  messages: number;
  messagesLength: number;
  uid: string;
  gid: string;
}
