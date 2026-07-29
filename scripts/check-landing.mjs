import { chromium } from "playwright";
import path from "path";

const outDir = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 150)));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(outDir, "lp-hero.png") });

// Блок шагов: шаг 1 (тесты проходятся)
await page.evaluate(() => document.getElementById("how").scrollIntoView());
await page.waitForTimeout(4200);
await page.screenshot({ path: path.join(outDir, "lp-step1.png") });

// Переключить на шаг 2 (отчёт)
await page.getByRole("button", { name: /Получи комплексный отчёт/ }).click();
await page.waitForTimeout(2600);
await page.screenshot({ path: path.join(outDir, "lp-step2.png") });

// Шаг 3 (чат)
await page.getByRole("button", { name: /Спроси AI/ }).click();
await page.waitForTimeout(3400);
await page.screenshot({ path: path.join(outDir, "lp-step3.png") });

// Опоры и FAQ
await page.evaluate(() => document.getElementById("pillars").scrollIntoView());
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(outDir, "lp-pillars.png") });

console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "OK, no page errors");
await browser.close();
