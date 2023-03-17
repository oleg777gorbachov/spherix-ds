import { category } from "../../utils";
import bans from "./bans";
import kick from "./kick";
import mute from "./mute";
import blacklist from "./blacklist";
import timeout from "./timeout";
import clear from "./clear";
import slowmode from "./slowmode";
import tempRole from "./tempRole";

export default category("moderation", [
  ...mute,
  ...blacklist,
  ...clear,
  kick,
  slowmode,
  tempRole,
  timeout,
  ...bans,
]);
