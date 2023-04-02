import { category } from "../../utils";
import automod from "./automod";
import settings from "./settings";
import options from "./options";
import blacklist from "./blacklist";

export default category("automod", [
  automod,
  ...blacklist,
  settings,
  ...options,
]);
