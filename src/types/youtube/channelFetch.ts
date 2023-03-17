import { snippetI } from "./snippet";

export interface channelFetchI {
  kind: string;
  etag: string;
  id: string;
  items: itemI[];
}

interface itemI {
  kind: string;
  etag: string;
  id: string;
  snippet: snippetI;
}
