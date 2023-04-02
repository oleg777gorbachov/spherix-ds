import { Document } from "mongoose";

export interface reminderI extends Document {
  uid: string;
  message: string;
  expires: number;
  id: number;
}
