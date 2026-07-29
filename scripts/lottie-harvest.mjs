// Массовая загрузка Lottie-анимаций по тематическим категориям платформы.
// Скачивает ~100 файлов в public/lottie/gallery/ и пишет манифест lib/lottie-gallery.json
// Использование: node scripts/lottie-harvest.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "lottie", "gallery");
const manifestPath = path.join(root, "lib", "lottie-gallery.json");
fs.mkdirSync(outDir, { recursive: true });

// Категория → поисковые запросы (со стилевыми словами для однородности)
const categories = {
  "Образование": ["education flat", "school learning flat", "books flat"],
  "Ученик": ["student flat", "student studying"],
  "Выпускной": ["graduation flat", "graduation cap"],
  "Тесты и чек-листы": ["quiz test flat", "checklist flat", "exam"],
  "AI и роботы": ["robot flat", "chatbot flat", "AI assistant"],
  "Карьера": ["career flat", "job interview flat", "profession"],
  "Университет": ["university building flat", "college campus"],
  "Достижения": ["trophy flat", "achievement medal flat", "winner"],
  "Праздник": ["confetti", "celebration flat"],
  "Поиск": ["search magnifier flat", "search find"],
  "Аналитика": ["chart analytics flat", "data graph flat"],
  "Идеи": ["idea lightbulb flat", "creativity flat"],
  "Команда и общение": ["teamwork flat", "communication chat flat"],
  "Навигация": ["compass flat", "map direction flat"],
  "Старт": ["rocket launch flat", "startup rocket"],
  "Документы": ["certificate flat", "documents folder flat"],
  "Мышление": ["brain thinking flat", "psychology mind"],
};

const PER_QUERY = 6;
const TARGET = 150; // общий предохранитель
const CAT_CAP = 8; // максимум на категорию — чтобы покрыть все темы

const gql = `query($q: String!, $n: Int!) {
  searchPublicAnimations(query: $q, first: $n) {
    edges { node { id name lottieUrl url downloads } }
  }
}`;

async function search(q, n) {
  const res = await fetch("https://graphql.lottiefiles.com/2022-08", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: gql, variables: { q, n } }),
  });
  const json = await res.json();
  return (json.data?.searchPublicAnimations?.edges ?? []).map((e) => e.node);
}

const seen = new Set();
const manifest = [];
let downloaded = 0;

for (const [category, queries] of Object.entries(categories)) {
  let inCategory = 0;
  for (const q of queries) {
    if (downloaded >= TARGET || inCategory >= CAT_CAP) break;
    let nodes = [];
    try {
      nodes = await search(q, PER_QUERY);
    } catch (e) {
      console.error(`search failed "${q}": ${e.message}`);
      continue;
    }
    nodes.sort((a, b) => b.downloads - a.downloads);
    for (const node of nodes) {
      if (downloaded >= TARGET || inCategory >= CAT_CAP) break;
      if (seen.has(node.id) || !node.lottieUrl) continue;
      seen.add(node.id);
      const fname = `${node.id}.lottie`;
      const fpath = path.join(outDir, fname);
      try {
        if (!fs.existsSync(fpath)) {
          const r = await fetch(node.lottieUrl);
          if (!r.ok) continue;
          const buf = Buffer.from(await r.arrayBuffer());
          if (buf.length < 500 || buf.length > 600_000) continue; // мусор и монстры
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
        downloaded++;
        inCategory++;
        process.stdout.write(
          `\r${String(downloaded).padStart(3)} / ${TARGET}  [${category}] ${node.name.slice(0, 40)}          `
        );
      } catch (e) {
        console.error(`\ndownload failed ${node.name}: ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, 60));
    }
  }
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
const total = manifest.reduce((s, m) => s + m.sizeKB, 0);
console.log(
  `\n\nГотово: ${manifest.length} анимаций, ${Math.round(total / 1024)} МБ → ${manifestPath}`
);
const byCat = {};
for (const m of manifest) byCat[m.category] = (byCat[m.category] ?? 0) + 1;
for (const [c, n] of Object.entries(byCat)) console.log(`  ${c}: ${n}`);
