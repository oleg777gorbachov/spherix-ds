import { Document } from "mongoose";

export interface premiumI extends Document {
  gid: string;
  state: boolean;
  lastBuy: number;
}
