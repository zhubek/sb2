import { chromium } from "playwright";
import path from "path";

const outDir = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 150)));

// Лендинг с компасом
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await page.screenshot({ path: path.join(outDir, "auto-landing.png") });

// Пройти тест Голланда до конца → чек-лист должен открыться сам с конфетти
await page.goto("http://localhost:3000/tests/holland", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Начать тест" }).click();
await page.waitForTimeout(2200); // заставка «тест начинается»
for (let s = 0; s < 3; s++) {
  await page.waitForTimeout(300);
  for (const card of await page.locator("div.rounded-2xl.border.bg-white").all()) {
    const btn = card.getByRole("button", { name: "4", exact: true });
    if (await btn.count()) await btn.first().click();
  }
  await page.getByRole("button", { name: /Следующий раздел|Завершить тест/ }).click();
}
// обработка ответов ~2.5s, затем событие чек-листа
await page.waitForTimeout(3300);
await page.screenshot({ path: path.join(outDir, "auto-checklist-confetti.png") });
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(outDir, "auto-checklist-struck.png") });

console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "OK, no page errors");
await browser.close();
