// Проверка: карусель в герое, наклон и оживающие экраны в колоде
import { chromium } from "playwright";
import fs from "node:fs";

const OUT = process.env.SHOT_DIR || "shots-landing";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text().slice(0, 200));
});

await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/anim-hero.png` });

// Скроллим к колоде так, чтобы была активна 2-я карточка (чат)
const pin = page.locator("#what div[style*='210vh']");
const box = await pin.boundingBox();
await page.mouse.wheel(0, box.y + box.height * 0.38);
await page.waitForTimeout(2200);
await page.screenshot({ path: `${OUT}/anim-chat.png` });

console.log("console errors:", errors.length ? errors : "none");
await browser.close();
