// Скачивает публичные Lottie-анимации конкретного автора LottieFiles
// и добавляет их в манифест галереи (lib/lottie-gallery.json).
// Использование: node scripts/lottie-harvest-user.mjs <userId> "<категория>" ["<regex-фильтр по названию>"]

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const userId = process.argv[2];
const category = process.argv[3] ?? "Автор";
const nameFilter = process.argv[4] ? new RegExp(process.argv[4], "i") : null;
if (!userId) {
  console.error('Usage: node scripts/lottie-harvest-user.mjs <userId> "<category>" ["<name regex>"]');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "lottie", "gallery");
const manifestPath = path.join(root, "lib", "lottie-gallery.json");
fs.mkdirSync(outDir, { recursive: true });

const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : [];
const known = new Set(manifest.map((m) => String(m.id)));

const gql = `query($userId: ID!, $after: String) {
  publicAnimationsByUser(userId: $userId, first: 50, after: $after) {
    pageInfo { endCursor hasNextPage }
    edges { node { id name lottieUrl url downloads } }
  }
}`;

async function fetchPage(after) {
  const r = await fetch("https://graphql.lottiefiles.com/2022-08", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: gql, variables: { userId, after } }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(j.errors[0].message);
  return j.data.publicAnimationsByUser;
}

// Собрать весь каталог с пагинацией
const nodes = [];
let after = null;
for (let page = 0; page < 20; page++) {
  const data = await fetchPage(after);
  nodes.push(...data.edges.map((e) => e.node));
  if (!data.pageInfo.hasNextPage) break;
  after = data.pageInfo.endCursor;
}
console.log(`Всего анимаций у автора: ${nodes.length}`);
const filtered = nameFilter
  ? nodes.filter((n) => nameFilter.test(n.name))
  : nodes;
if (nameFilter)
  console.log(`После фильтра "${process.argv[4]}": ${filtered.length}`);

let added = 0;
let skipped = 0;
for (const node of filtered) {
  if (known.has(String(node.id))) {
    // уже в галерее — просто переводим в категорию автора
    const entry = manifest.find((m) => String(m.id) === String(node.id));
    if (entry) entry.category = category;
    skipped++;
    continue;
  }
  if (!node.lottieUrl) continue;
  const fname = `${node.id}.lottie`;
  const fpath = path.join(outDir, fname);
  try {
    if (!fs.existsSync(fpath)) {
      const r = await fetch(node.lottieUrl);
      if (!r.ok) continue;
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 500 || buf.length > 900_000) continue;
      fs.writeFileSync(fpath, buf);
    }
    const sizeKB = Math.round(fs.statSync(fpath).size / 1024);
    manifest.push({
      id: String(node.id),
      category,
      name: node.name.slice(0, 60),
      file: `/lottie/gallery/${fname}`,
      sizeKB,
      src: node.url,
    });
    known.add(String(node.id));
    added++;
    process.stdout.write(`\r${added} скачано: ${node.name.slice(0, 45)}            `);
  } catch (e) {
    console.error(`\nошибка ${node.name}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 60));
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(
  `\nГотово: +${added} новых (${skipped} уже были), всего в галерее ${manifest.length}`
);
