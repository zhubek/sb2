import { chromium } from "playwright";
import path from "path";

const outDir = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 150)));

// 1. Лендинг с Lottie-героем
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.screenshot({ path: path.join(outDir, "int-landing.png") });

// 2. Чек-лист: открыть, кликнуть невыполненный пункт → конфетти
await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Чек-лист и прогресс" }).click();
await page.waitForTimeout(400);
await page.getByText("Пройти тест Голланда", { exact: false }).first().click();
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, "int-confetti.png") });

// 3. AI чат: отправить вопрос → индикатор «думает»
await page.goto("http://localhost:3000/chat", { waitUntil: "networkidle" });
await page.getByPlaceholder("Задайте вопрос…").fill("Какие профессии мне подходят?");
await page.keyboard.press("Enter");
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(outDir, "int-chat-thinking.png") });

// 4. Тест: интро с Lottie → «тест начинается»
await page.goto("http://localhost:3000/tests/debruce", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.screenshot({ path: path.join(outDir, "int-test-intro.png") });
await page.getByRole("button", { name: "Начать тест" }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: path.join(outDir, "int-test-starting.png") });

// 5. Онбординг
await page.goto("http://localhost:3000/onboarding", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.screenshot({ path: path.join(outDir, "int-onboarding.png") });

console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "OK, no page errors");
await browser.close();
