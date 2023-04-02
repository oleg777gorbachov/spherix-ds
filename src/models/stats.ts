import { Schema, model } from "mongoose";
import { statsI } from "../types";

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema(
  {
    state: {
      type: Boolean,
      required: true,
    },
    allMembersId: reqString,
    botId: reqString,
    membersId: reqString,
    categoryId: reqString,
    gid: reqString,
  },
  {
    timestamps: true,
  }
);

export default model<statsI>("stats-channel", schema);
