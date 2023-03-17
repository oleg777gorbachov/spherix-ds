import { Schema, model } from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema(
  {
    gid: reqString,
    warns: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("warns", schema);
