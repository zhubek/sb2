import { chromium } from "playwright";
import path from "path";

const outDir = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

// Тест DeBruce: вводный экран → раздел с вопросами
await page.goto("http://localhost:3000/tests/debruce", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Начать тест" }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(outDir, "quiz-section1.png") });

// Ответить на все вопросы раздела и перейти дальше
for (const card of await page.locator("div.rounded-2xl.border.bg-white").all()) {
  const btn = card.getByRole("button", { name: "4", exact: true });
  if (await btn.count()) await btn.first().click();
}
await page.waitForTimeout(200);
await page.screenshot({ path: path.join(outDir, "quiz-answered.png") });

// AI чат с подсказками у поля ввода
await page.goto("http://localhost:3000/chat", { waitUntil: "networkidle" });
await page.screenshot({ path: path.join(outDir, "chat-hints.png") });

// Кабинет: раскрытый MBTI с кнопкой «Перепройти тест»
await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Подробнее" }).nth(1).click();
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(outDir, "dashboard-retake.png") });

console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "OK, no page errors");
await browser.close();
