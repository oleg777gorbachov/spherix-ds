import { category } from "../../utils";
import play from "./play";
import skip from "./skip";
import queue from "./queue";
import pause from "./pause";
import current from "./current";
import playLoop from "./play-loop";

export default category("music", [play, playLoop, current, pause, queue, skip]);
