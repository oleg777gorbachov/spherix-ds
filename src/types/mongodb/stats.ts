import { Document } from "mongoose";

export interface statsI extends Document {
  state: boolean;
  allMembersId: string;
  botId: string;
  membersId: string;
  categoryId: string;
  gid: string;
}
