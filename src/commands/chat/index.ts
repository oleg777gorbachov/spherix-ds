import { category } from "../../utils";
import embed from "./embed";
import qrcode from "./qrcode";
import reminder from "./reminders";
import rank from "./rank";
import avatar from "./avatar";
import image from "./image";
import message from "./message";
import randomNumber from "./randomNumber";
import ticket from "./ticket";
import ai from "./AI";
import help from "./help";
import name from "./name";
import support from "./support";

export default category("chat", [
  ...rank,
  ...name,
  ...help,
  ...reminder,
  ...ai,
  ...embed,
  support,
  qrcode,
  avatar,
  image,
  message,
  randomNumber,
  ticket,
]);
