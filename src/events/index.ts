import { Event } from "../types";
import ready from "./ready";
import interactionCreate from "./interactionCreate";
import statsChange from "./statsChange";
import voiceUpdate from "./voiceTemp";
import ranking from "./ranking";
import notification from "./notification";
import blacklist from "./blacklist";
import commands from "./commands";
import welcome from "./welcome";
import handlers from "./handlers";

const events: Event<any>[] = [
  ready,
  ...handlers,
  ...commands,
  ...notification,
  voiceUpdate,
  ...blacklist,
  ...ranking,
  interactionCreate,
  ...welcome,
  ...statsChange,
];

export default events;
