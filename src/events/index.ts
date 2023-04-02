import { Event } from "../types";
import ready from "./ready";
import interactionCreate from "./interactionCreate";
import statsChange from "./statsChange";
import voiceUpdate from "./voiceTemp";
import ranking from "./ranking";
import notification from "./notification";
import commands from "./commands";
import welcome from "./welcome";
import handlers from "./handlers";
import logs from "./logs";
import reminders from "./reminders";
import automod from "./automod";

const events: Event<any>[] = [
  ...automod,
  reminders,
  ready,
  ...logs,
  ...handlers,
  ...commands,
  ...notification,
  voiceUpdate,
  ...ranking,
  interactionCreate,
  ...welcome,
  ...statsChange,
];

export default events;
