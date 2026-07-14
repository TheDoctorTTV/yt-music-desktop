import { createPreviewHtml } from "../src/custom_ui.ts";

const html = createPreviewHtml();
const port = 4176;

Deno.serve({ hostname: "127.0.0.1", port }, (request: Request): Response => {
  const url = new URL(request.url);

  if (url.pathname === "/health") {
    return Response.json({ ok: true, preview: true });
  }

  if (url.pathname === "/" || url.pathname === "/preview") {
    return new Response(html, {
      headers: {
        "cache-control": "no-store",
        "content-type": "text/html; charset=utf-8",
      },
    });
  }

  return new Response("Not found", { status: 404 });
});

console.log(`Custom UI preview available at http://127.0.0.1:${port}/`);
