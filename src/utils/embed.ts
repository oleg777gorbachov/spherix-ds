import { Colors } from "./color/colors";
import { APIEmbed, JSONEncodable } from "discord.js";

export const embed = (props: APIEmbed): APIEmbed | JSONEncodable<APIEmbed> => {
  return { color: Colors.error, ...props };
};
