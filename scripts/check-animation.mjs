import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
const hero = page.locator("svg").first();
await hero.screenshot({ path: path.join(outDir, "anim-frame1.png") });
await page.waitForTimeout(900);
await hero.screenshot({ path: path.join(outDir, "anim-frame2.png") });

const a = fs.readFileSync(path.join(outDir, "anim-frame1.png"));
const b = fs.readFileSync(path.join(outDir, "anim-frame2.png"));
console.log(
  a.equals(b)
    ? "FRAMES IDENTICAL — animation NOT running"
    : "Frames differ — animation is running ✓"
);
await browser.close();
