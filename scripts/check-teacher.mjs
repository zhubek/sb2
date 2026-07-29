import { chromium } from "playwright";
import path from "path";

const outDir = process.argv[2];
const routes = [
  ["teacher-login", "/teacher/login"],
  ["teacher-dashboard", "/teacher"],
  ["teacher-assistant", "/teacher/assistant"],
  ["teacher-analytics", "/teacher/analytics"],
  ["teacher-student", "/teacher/analytics/student/st1"],
  ["teacher-handbook", "/teacher/handbook"],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

for (const [name, route] of routes) {
  await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, `${name}.png`) });
  console.log(`captured ${name}`);
}

console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "OK, no page errors");
await browser.close();
