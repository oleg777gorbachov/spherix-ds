import { category } from "../../utils";
import embed from "./embed";
import qrcode from "./qrcode";
import reminder from "./remind";
import rank from "./rank";
import avatar from "./avatar";
import image from "./image";
import message from "./message";
import randomNumber from "./randomNumber";
import ticket from "./ticket";
import ai from "./AI";
import help from "./help";

export default category("chat", [
  ...rank,
  ...help,
  reminder,
  ...ai,
  ...embed,
  qrcode,
  avatar,
  image,
  message,
  randomNumber,
  ticket,
]);
