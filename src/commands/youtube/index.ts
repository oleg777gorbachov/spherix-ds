import { category } from "../../utils";
import youtubeAdd from "./youtube-add";
import youtubeRemove from "./youtube-remove";
import youtubeMessage from "./youtube-message";
import youtubeChannel from "./youtube-channel";
import list from "./list";

export default category("youtbe", [
  youtubeAdd,
  list,
  youtubeChannel,
  youtubeMessage,
  youtubeRemove,
]);
