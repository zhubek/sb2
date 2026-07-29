import { chromium } from "playwright";
import path from "path";

const outDir = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning")
    console.log(`[console.${m.type()}]`, m.text().slice(0, 300));
});
page.on("pageerror", (e) => console.log("[pageerror]", e.message.slice(0, 300)));
page.on("requestfailed", (r) =>
  console.log("[requestfailed]", r.url(), r.failure()?.errorText)
);

await page.goto("http://localhost:3000/tests/holland", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Начать тест" }).click();

for (let s = 0; s < 3; s++) {
  await page.waitForTimeout(250);
  for (const card of await page.locator("div.rounded-2xl.border.bg-white").all()) {
    const btn = card.getByRole("button", { name: "4", exact: true });
    if (await btn.count()) await btn.first().click();
  }
  await page.getByRole("button", { name: /Следующий раздел|Завершить тест/ }).click();
}

await page.waitForTimeout(1500);
const canvasCount = await page.locator("canvas").count();
console.log("canvas elements:", canvasCount);
await page.screenshot({ path: path.join(outDir, "lottie-debug.png") });
await browser.close();
