import { Document } from "mongoose";

export interface automodI extends Document {
  gid: string;
  state: boolean;
  spam: boolean;
  badwords: boolean;
  duplicateText: boolean;
  invites: boolean;
  links: boolean;
  caps: boolean;
  emoji: boolean;
  mention: boolean;
  whitelist: string[];
  words: string[];
  whitelistlinks: string[];
  maxEmoji: number;
}
