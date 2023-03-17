import { Document } from "mongoose";

export interface blacklistI extends Document {
  gid: string;
  whitelist: string[];
  words: string[];
}
