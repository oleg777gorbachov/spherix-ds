import { Configuration, OpenAIApi } from "openai";
import Keys from "../../keys";

const cfg = new Configuration({
  apiKey: Keys.openAi_api_key,
});

export const OpenAi = new OpenAIApi(cfg);
