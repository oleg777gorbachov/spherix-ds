import { category } from "../../utils";
import play from "./play";
import skip from "./skip";
import queue from "./queue";
import pause from "./pause";
import current from "./current";
import playLoop from "./play-loop";
import playChannel from "./play-channel";
import remove from "./play-channel-remove";

export default category("music", [
  play,
  remove,
  playChannel,
  playLoop,
  current,
  pause,
  queue,
  skip,
]);
