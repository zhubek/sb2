// Плавный скролл по якорям — проверяем, что .rv блоки проявляются
import { chromium } from "playwright";
import fs from "node:fs";

const OUT = process.env.SHOT_DIR || "shots-landing";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

for (const id of ["how", "privacy", "faq", "codes"]) {
  await page.evaluate(
    (sel) => document.getElementById(sel)?.scrollIntoView({ behavior: "instant", block: "start" }),
    id
  );
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/v9-${id}.png` });
  console.log("shot:", id);
}
await browser.close();
