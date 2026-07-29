// Добор Lottie-анимаций в галерею по поисковым запросам
// Использование: node scripts/lottie-harvest-search.mjs "<категория>" <макс> "<запрос1>" "<запрос2>" ...

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const [category, capArg, ...queries] = process.argv.slice(2);
const cap = Number(capArg ?? 20);
if (!category || !queries.length) {
  console.error('Usage: node scripts/lottie-harvest-search.mjs "<category>" <cap> "<query>"...');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "lottie", "gallery");
const manifestPath = path.join(root, "lib", "lottie-gallery.json");
fs.mkdirSync(outDir, { recursive: true });
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const known = new Set(manifest.map((m) => String(m.id)));

const gql = `query($q: String!, $n: Int!) {
  searchPublicAnimations(query: $q, first: $n) {
    edges { node { id name lottieUrl url downloads } }
  }
}`;

let added = 0;
for (const q of queries) {
  if (added >= cap) break;
  const r = await fetch("https://graphql.lottiefiles.com/2022-08", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: gql, variables: { q, n: 12 } }),
  });
  const j = await r.json();
  const nodes = (j.data?.searchPublicAnimations?.edges ?? [])
    .map((e) => e.node)
    .sort((a, b) => b.downloads - a.downloads);
  for (const node of nodes) {
    if (added >= cap) break;
    if (known.has(String(node.id)) || !node.lottieUrl) continue;
    known.add(String(node.id));
    const fname = `${node.id}.lottie`;
    const fpath = path.join(outDir, fname);
    try {
      if (!fs.existsSync(fpath)) {
        const res = await fetch(node.lottieUrl);
        if (!res.ok) continue;
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 500 || buf.length > 600_000) continue;
        fs.writeFileSync(fpath, buf);
      }
      manifest.push({
        id: String(node.id),
        category,
        name: node.name.slice(0, 60),
        file: `/lottie/gallery/${fname}`,
        sizeKB: Math.round(fs.statSync(fpath).size / 1024),
        src: node.url,
      });
      added++;
      process.stdout.write(`\r${added} скачано: ${node.name.slice(0, 45)}          `);
    } catch {}
    await new Promise((r) => setTimeout(r, 60));
  }
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\nГотово: +${added}, всего ${manifest.length}`);
