import type { APIRoute } from "astro";
import { getSiteSettings } from "../utils/sanity";

export const GET: APIRoute = async () => {
  const settings = await getSiteSettings() as Record<string, any> | null;
  const content = settings?.llmsTxt as string | undefined;

  if (!content) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(content, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
