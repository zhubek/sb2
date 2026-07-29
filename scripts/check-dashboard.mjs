import { chromium } from "playwright";
import path from "path";

const outDir = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle" });
await page.screenshot({ path: path.join(outDir, "dashboard-collapsed.png") });

await page.getByText("DeBruce", { exact: true }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(outDir, "dashboard-expanded.png") });

console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "OK, no page errors");
await browser.close();
