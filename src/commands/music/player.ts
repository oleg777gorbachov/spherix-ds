import { Player } from "discord-player";
import { Client } from "discord.js";
import {
  SpotifyExtractor,
  SoundCloudExtractor,
  YoutubeExtractor,
  AppleMusicExtractor,
  VimeoExtractor,
} from "@discord-player/extractor";

export const player = async (client: Client<boolean>) => {
  const player = new Player(client, {});
  const extractors = [
    SpotifyExtractor,
    SoundCloudExtractor,
    YoutubeExtractor,
    AppleMusicExtractor,
    VimeoExtractor,
  ];

  for (let extractor of extractors) {
    await player.extractors.register(extractor);
  }
  return player;
};
