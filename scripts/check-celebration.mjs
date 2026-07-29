import { chromium } from "playwright";
import path from "path";

const outDir = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 150)));

// Пройти тест Голланда → полноэкранное конфетти #88752
await page.goto("http://localhost:3001/tests/holland", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Начать тест" }).click();
await page.waitForTimeout(2200);
for (let s = 0; s < 3; s++) {
  await page.waitForTimeout(300);
  for (const card of await page.locator("div.rounded-2xl.border.bg-white").all()) {
    const btn = card.getByRole("button", { name: "4", exact: true });
    if (await btn.count()) await btn.first().click();
  }
  await page.getByRole("button", { name: /Следующий раздел|Завершить тест/ }).click();
}
await page.waitForTimeout(3100); // обработка 2.5s + событие чек-листа
await page.screenshot({ path: path.join(outDir, "celebrate-1.png") });
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(outDir, "celebrate-2.png") });

console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "OK, no page errors");
await browser.close();
