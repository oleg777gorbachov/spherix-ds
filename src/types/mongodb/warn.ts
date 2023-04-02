import { Document } from "mongoose";

export interface warnI extends Document {
  gid: string;
  uid: string;
  modId: string;
  reason: string;
  id: number;
}
