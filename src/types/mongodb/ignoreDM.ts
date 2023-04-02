import { Document } from "mongoose";

export interface ignoreDMI extends Document {
  uid: string;
  gids: string[];
  isAll: boolean;
}
