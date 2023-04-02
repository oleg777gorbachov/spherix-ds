import off from "./off";
import list from "./list";
import on from "./on";
import ofAll from "./off-all";
import onAll from "./on-all";
import help from "./help";
import { category } from "../../utils";

export default category("your-notification", [
  off,
  list,
  on,
  ofAll,
  help,
  onAll,
]);
