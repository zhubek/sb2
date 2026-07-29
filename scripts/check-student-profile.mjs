import { chromium } from "playwright";

const BASE = "http://localhost:3001";
const SHOTS =
  "C:/Users/zhumi/AppData/Local/Temp/claude/C--Users-zhumi-Documents-Projects-sb2/f332f45b-7bc7-4ee6-8180-25136c704846/scratchpad/shots";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const logs = [];
page.on("console", (m) => m.type() === "error" && logs.push(m.text()));

// Avatar in nav links to /profile
await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
await page.getByRole("link", { name: "Мой профиль" }).click();
await page.waitForURL("**/profile");
console.log("h1:", await page.locator("h1").first().innerText());
await page.screenshot({ path: `${SHOTS}/s1-profile.png` });

// Edit + save, nav name updates live
await page.locator("input").first().fill("Айгерим-тест");
await page.getByRole("button", { name: "Сохранить изменения" }).click();
await page.waitForTimeout(300);
console.log(
  "saved:",
  await page.getByRole("button", { name: "Сохранено" }).isVisible()
);
console.log(
  "nav name updated:",
  await page.locator("header").innerText().then((t) => t.includes("Айгерим-тест"))
);
await page.screenshot({ path: `${SHOTS}/s2-profile-saved.png` });

console.log("console errors:", logs.length ? logs.slice(0, 5) : "none");
await browser.close();
