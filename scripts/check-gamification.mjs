import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = process.argv[2];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 150)));

// 1. Геймификация: незавершённое состояние с баннером о сертификате
await page.goto("http://localhost:3001/teacher/gamification", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(outDir, "gam-1-progress.png") });

// 2. Завершить оставшиеся шаги → баннер с кнопкой скачивания
await page.getByRole("button", { name: "Пройти мини-тест" }).click();
await page.waitForTimeout(300);
await page.getByRole("button", { name: "Отметить просмотренным" }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, "gam-2-done.png") });

// 3. Скачать сертификат
const downloadPromise = page.waitForEvent("download");
await page.getByRole("button", { name: /Скачать сертификат/ }).click();
const download = await downloadPromise;
const certPath = path.join(outDir, "certificate.svg");
await download.saveAs(certPath);
console.log("cert saved:", fs.statSync(certPath).size, "bytes");

// 4. Страница проверки по QR-ссылке
await page.goto("http://localhost:3001/verify/PRF-2026-GA-0417", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(outDir, "gam-3-verify.png") });

// 5. Профиль показывает сертификат
await page.goto("http://localhost:3001/teacher/profile", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(outDir, "gam-4-profile.png") });

// 6. Библиотека
await page.goto("http://localhost:3001/teacher/library", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(outDir, "gam-5-library.png") });

console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "OK, no page errors");
await browser.close();
