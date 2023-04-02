import debug from "./debug";
import moderation from "./moderation";
import notification from "./twitch";
import text from "./chat";
import start from "./start";
import channel from "./channels";
import reaction from "./reaction";
import youtube from "./youtube";
import music from "./music";
import dm from "./dm";
import automod from "./automod";

export default [
  automod,
  channel,
  dm,
  music,
  youtube,
  reaction,
  debug,
  moderation,
  notification,
  text,
  start,
];
