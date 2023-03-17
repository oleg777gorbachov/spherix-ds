import { connect } from "mongoose";
import Keys from "../keys";

export default function dbConnect() {
  const url = Keys.dbUrl;
  if (!url) {
    throw new Error("URL is undefined");
  }
  connect(url);
}
