import { Document } from "mongoose";

export interface punishmentI extends Document {
  gid: string;
  uid: string;
  modId: string;
  reason: string;
  expires: number;
  type: "ban" | "mute" | "timeout";
}
