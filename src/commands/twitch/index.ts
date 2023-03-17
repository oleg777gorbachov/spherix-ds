import { category } from "../../utils";
import addnotification from "./twitch-add";
import setNotification from "./twitch-channel";
import list from "./list";
import removeNotification from "./twitch-remove";
import setmessage from "./twitch-message";

export default category("twitch", [
  addnotification,
  setmessage,
  removeNotification,
  list,
  setNotification,
]);
