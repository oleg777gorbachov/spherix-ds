import { Document } from "mongoose";

export interface statsI extends Document {
  state: boolean;
  onlineId: string;
  membersId: string;
  categoryId: string;
  gid: string;
}
