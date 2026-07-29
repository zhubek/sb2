import { chromium } from "playwright";
import path from "path";

const outDir = process.argv[2];
const routes = [
  ["home", "/"],
  ["dashboard", "/dashboard"],
  ["tests", "/tests"],
  ["universities", "/universities"],
  ["portfolio", "/portfolio"],
  ["chat", "/chat"],
  ["teacher", "/teacher"],
  ["admin", "/admin"],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`[console] ${msg.text()}`);
});
page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));
page.on("requestfailed", (req) =>
  errors.push(`[requestfailed] ${req.url()} ${req.failure()?.errorText}`)
);

for (const [name, route] of routes) {
  await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, `${name}.png`) });
  console.log(`captured ${name} (${route})`);
}

console.log(errors.length ? `\nERRORS:\n${errors.join("\n")}` : "\nNo console/network errors.");
await browser.close();
