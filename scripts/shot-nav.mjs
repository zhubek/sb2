import { chromium } from "playwright";
import path from "path";

const outDir = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
await page.goto("http://localhost:3000/design", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Иллюстрации" }).click();
await page.getByRole("button", { name: /Навигация/ }).click();
await page.evaluate(() => window.scrollTo(0, 1300));
await page.waitForTimeout(5000);
await page.screenshot({ path: path.join(outDir, "ref-navigation.png") });
await browser.close();
console.log("done");
