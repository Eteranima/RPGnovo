import handler from "vinext/server/fetch-handler";
import { MEDIA_MANIFEST } from "./media-manifest";
import { serveMediaAsset } from "./media-range";

interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const media = await serveMediaAsset(request, env.ASSETS, MEDIA_MANIFEST);
    return media ?? handler.fetch(request, env, ctx);
  },
};
