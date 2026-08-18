// Скриншоты ключевых страниц после смены цветовой системы
import { chromium } from "playwright";
import fs from "node:fs";

const OUT = process.env.SHOT_DIR || "shots-restyle";
fs.mkdirSync(OUT, { recursive: true });

const pages = [
  ["landing", "http://localhost:3001/", 1600],
  ["dashboard", "http://localhost:3001/dashboard", 1200],
  ["tests", "http://localhost:3001/tests", 1200],
  ["universities", "http://localhost:3001/universities", 1200],
  ["chat", "http://localhost:3001/chat", 900],
  ["profile", "http://localhost:3001/profile", 900],
  ["teacher", "http://localhost:3001/teacher", 1200],
  ["teacher-cert", "http://localhost:3001/teacher/certificate", 1200],
  ["teacher-handbook", "http://localhost:3001/teacher/handbook", 1200],
  ["admin", "http://localhost:3001/admin", 1200],
  ["auth", "http://localhost:3001/auth", 900],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text().slice(0, 200));
});

for (const [name, url, h] of pages) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: `${OUT}/${name}.png`,
    clip: { x: 0, y: 0, width: 1440, height: Math.min(h, 900) },
  });
  // Полная высота для лендинга
  if (name === "landing") {
    await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });
  }
  console.log("shot:", name);
}

console.log("console errors:", errors.length ? errors : "none");
await browser.close();
