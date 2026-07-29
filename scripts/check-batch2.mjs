import { chromium } from "playwright";
import path from "path";

const outDir = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 150)));

// 1. ВУЗы: карточки на всю ширину + вкладки
await page.goto("http://localhost:3001/universities", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(outDir, "b2-unis.png") });
await page.getByRole("button", { name: "Программы" }).first().click();
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(outDir, "b2-unis-tab.png") });

// 2. Портфолио: карточки + попап + дрожащий сертификат
await page.goto("http://localhost:3001/portfolio", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.screenshot({ path: path.join(outDir, "b2-portfolio.png") });
await page.getByText("Диплом — олимпиада", { exact: false }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(outDir, "b2-portfolio-modal.png") });
await page.keyboard.press("Escape");

// 3. Конфетти на весь экран после теста Голланда
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
await page.waitForTimeout(3200);
await page.screenshot({ path: path.join(outDir, "b2-confetti-1.png") });
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(outDir, "b2-confetti-2.png") });

console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "OK, no page errors");
await browser.close();
