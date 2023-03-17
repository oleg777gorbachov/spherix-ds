import { channelFetchI } from "./../../types/youtube/channelFetch";
import Keys from "../../keys";
import fetch from "node-fetch";

export async function channelName(id: string): Promise<
  | {
      state: boolean;
      name?: string;
    }
  | undefined
> {
  const apiCheck = `https://www.googleapis.com/youtube/v3/channels?id=${id}&part=snippet&key=${Keys.youtube_api_key}`;
  const response = await fetch(apiCheck);
  const data: channelFetchI = await response.json();
  if ((data as any).error) {
    console.log("CHECK CHANNEL ERROR");
    return;
  }
  const name = data.items[0].snippet.title;
  if (!name) {
    return { state: false };
  }
  return { state: true, name };
}

interface itemsI {
  kind: string;
  etag: string;
  id: {
    kind: "youtube#channel" | "youtube#video";
    videoId?: string;
    channelId?: string;
  };
  snippet: {
    channelId: string;
    title: string;
    description: string;
    channelTitle: string;
    publishTime: string;
  };
}

interface fetchVideosI {
  items: itemsI[];
}

export async function fetchVideos(id: string) {
  const api = `https://www.googleapis.com/youtube/v3/search?key=${Keys.youtube_api_key}&channelId=${id}&part=snippet,id&order=date&maxResults=2`;
  const response = await fetch(api);
  const data: fetchVideosI = await response.json();
  if ((data as any).error) {
    console.log("FETCH VIDEOS ERROR");
    return;
  }
  return data;
}
