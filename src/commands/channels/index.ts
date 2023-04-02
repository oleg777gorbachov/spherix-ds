import { category } from "../../utils";
import tempChannel from "./tempChannel";
import modChannel from "./modChannel";
import stats from "./statsChannel";
import logs from "./logChannel";

export default category("channels", [tempChannel, logs, stats, modChannel]);
