import { Colors } from "./color/colors";
import {
  APIEmbed,
  APIEmbedFooter,
  APIEmbedImage,
  JSONEncodable,
} from "discord.js";

interface EmbedI {
  description?: string;
  title: string;
  color?: APIEmbed["color"];
  footer?: APIEmbedFooter;
  image?: APIEmbedImage;
}

export const embed = ({
  color,
  description,
  title,
  footer,
  image,
}: EmbedI): APIEmbed | JSONEncodable<APIEmbed> => {
  return { color: color || Colors.error, description, title, footer, image };
};
