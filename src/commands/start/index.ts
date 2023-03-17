import { category } from "../../utils";
import startRole from "./start-role";
import deleteRole from "./start-delete";
import startMessage from "./start-message";
import startChannel from "./start-channel";

export default category("welcome", [
  startRole,
  startChannel,
  startMessage,
  deleteRole,
]);
