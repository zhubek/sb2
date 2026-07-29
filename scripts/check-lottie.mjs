import { chromium } from "playwright";
import path from "path";

const outDir = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

// Пройти тест Голланда до конца и поймать экран обработки с Lottie
await page.goto("http://localhost:3000/tests/holland", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Начать тест" }).click();

for (let s = 0; s < 3; s++) {
  await page.waitForTimeout(250);
  for (const card of await page.locator("div.rounded-2xl.border.bg-white").all()) {
    const btn = card.getByRole("button", { name: "4", exact: true });
    if (await btn.count()) await btn.first().click();
  }
  const next = page.getByRole("button", { name: /Следующий раздел|Завершить тест/ });
  await next.click();
}

await page.waitForTimeout(1000);
await page.screenshot({ path: path.join(outDir, "lottie-processing.png") });

console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "OK, no page errors");
await browser.close();
