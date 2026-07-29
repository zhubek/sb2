import { chromium } from "playwright";

const BASE = "http://localhost:3001";
const SHOTS =
  "C:/Users/zhumi/AppData/Local/Temp/claude/C--Users-zhumi-Documents-Projects-sb2/f332f45b-7bc7-4ee6-8180-25136c704846/scratchpad/shots";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const logs = [];
page.on("console", (m) => m.type() === "error" && logs.push(m.text()));

// 1. Sidebar: no Обучение/Геймификация, cert widget present
await page.goto(`${BASE}/teacher`, { waitUntil: "networkidle" });
const navText = await page.locator("aside, nav").first().innerText();
console.log("nav has Обучение:", navText.includes("Обучение"));
console.log("nav has Геймификация:", navText.includes("Геймификация"));
console.log("nav has Сертификат:", navText.includes("Сертификат"));
console.log("nav has Библиотека:", navText.includes("Библиотека"));

// 2. Open cert flyout
await page.getByRole("button", { name: /Сертификат/ }).click();
await page.waitForTimeout(400);
console.log(
  "flyout visible:",
  await page.getByText("Путь к сертификату").isVisible()
);
await page.screenshot({ path: `${SHOTS}/t1-cert-flyout.png` });

// 3. Certificate page + step completion -> confetti + widget strike
await page.goto(`${BASE}/teacher/certificate`, { waitUntil: "networkidle" });
console.log(
  "h1:",
  await page.locator("h1").first().innerText()
);
await page.screenshot({ path: `${SHOTS}/t2-cert-page.png` });
const actionBtn = page
  .getByRole("button", { name: /Пройти мини-тест|Отметить просмотренным/ })
  .first();
await actionBtn.click();
await page.waitForTimeout(900);
console.log(
  "widget auto-opened:",
  await page.getByText("Путь к сертификату").isVisible()
);
console.log("confetti canvas:", await page.locator("canvas").count());
await page.screenshot({ path: `${SHOTS}/t3-step-confetti.png` });

// 4. Handbook universities: teal explorer with chips
await page.goto(`${BASE}/teacher/handbook`, { waitUntil: "networkidle" });
console.log(
  "handbook chips:",
  await page.getByRole("button", { name: "Программа" }).isVisible(),
  await page.getByRole("button", { name: "Город" }).isVisible()
);
console.log(
  "handbook card tabs:",
  await page.getByRole("button", { name: "Обзор" }).first().isVisible()
);
await page.getByRole("button", { name: "Город" }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${SHOTS}/t4-handbook.png` });

// 5. Student universities: gmail-style search
await page.goto(`${BASE}/universities`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Программа" }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${SHOTS}/t5-universities.png` });

// 6. Profile + edit page
await page.goto(`${BASE}/teacher/profile`, { waitUntil: "networkidle" });
console.log(
  "edit link:",
  await page.getByRole("link", { name: /Редактировать/ }).isVisible()
);
await page.goto(`${BASE}/teacher/profile/edit`, { waitUntil: "networkidle" });
await page.locator('input').first().fill("Гульнара-тест");
await page.getByRole("button", { name: "Сохранить изменения" }).click();
await page.waitForTimeout(300);
console.log(
  "saved state:",
  await page.getByRole("button", { name: "Сохранено" }).isVisible()
);
await page.screenshot({ path: `${SHOTS}/t6-profile-edit.png` });

console.log("console errors:", logs.length ? logs.slice(0, 5) : "none");
await browser.close();
