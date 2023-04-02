import { category } from "../../utils";
import bans from "./bans";
import kick from "./kick";
import mute from "./mute";
import timeout from "./timeout";
import clear from "./clear";
import slowmode from "./slowmode";
import tempRole from "./tempRole";
import report from "./report";
import warn from "./warn";

export default category("moderation", [
  ...mute,
  ...warn,
  report,
  ...clear,
  kick,
  slowmode,
  tempRole,
  ...timeout,
  ...bans,
]);
