// Проверка лендинга v9: полный скрин, колода при скролле, переключение ҚАЗ
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
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/v9-full.png`, fullPage: true });

// Колода: скроллим внутрь pin-секции, должна показаться 3-я карточка
const pin = page.locator("#what div[style*='210vh']");
const box = await pin.boundingBox();
await page.mouse.wheel(0, box.y + box.height * 0.62);
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/v9-deck.png` });
const dotnum = await page.locator("#what span.font-mono").innerText();
console.log("deck counter:", dotnum);

// Переключение на казахский
await page.mouse.wheel(0, -100000);
await page.waitForTimeout(600);
await page.getByRole("button", { name: "ҚАЗ" }).click();
await page.waitForTimeout(400);
const h1 = await page.locator("h1").innerText();
console.log("kk h1:", h1);
await page.screenshot({ path: `${OUT}/v9-kk.png` });

console.log("console errors:", errors.length ? errors : "none");
await browser.close();
