import { chromium } from "playwright";
import path from "path";

const outDir = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1600 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

await page.goto("http://localhost:3000/design", { waitUntil: "networkidle" });
await page.screenshot({ path: path.join(outDir, "design-student.png") });

await page.getByRole("button", { name: "Педагог" }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(outDir, "design-teacher.png") });

await page.getByRole("button", { name: "Админ" }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(outDir, "design-admin.png") });

console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "OK, no page errors");
await browser.close();
