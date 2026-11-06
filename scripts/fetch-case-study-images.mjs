// Downloads the case-study images that are only hosted on Lovable (/__l5e/...)
// into public/case-studies/ and rewrites the case-study HTML to use them,
// so the pages work on Vercel. Run once: node scripts/fetch-case-study-images.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const LOVABLE = "https://family-visa-finder.lovable.app";
const htmlDir = "src/pages/case-studies";
const outDir = "public/case-studies";
mkdirSync(outDir, { recursive: true });

const re = /\/__l5e\/assets-v1\/[0-9a-f-]+\/([\w.-]+\.png)/g;
for (const file of readdirSync(htmlDir).filter((f) => f.endsWith(".html"))) {
  const path = join(htmlDir, file);
  let html = readFileSync(path, "utf8");
  for (const [src, name] of [...html.matchAll(re)]) {
    const res = await fetch(LOVABLE + src);
    const type = res.headers.get("content-type") || "";
    if (!res.ok || !type.startsWith("image/")) throw new Error(`${src}: ${res.status} ${type}`);
    writeFileSync(join(outDir, name), Buffer.from(await res.arrayBuffer()));
    html = html.replaceAll(src, `/case-studies/${name}`);
    console.log("saved", name);
  }
  writeFileSync(path, html);
}
