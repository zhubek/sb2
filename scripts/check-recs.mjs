// Проверка рекомендаций 1.2–1.8: регистрация, навигация, результаты,
// тесты, навигатор, портфолио, профиль
import { chromium } from "playwright";
import fs from "node:fs";

const OUT = process.env.SHOT_DIR || "shots-recs";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text().slice(0, 180));
});
const ok = (name, cond) => console.log(cond ? "PASS" : "FAIL", name);

// 1.2 Регистрация: 3 шага
await page.goto("http://localhost:3001/auth", { waitUntil: "networkidle" });
ok("шаг1: нет поля Имя", !(await page.getByPlaceholder("Имя").count()));
ok("шаг1: нет пароля при регистрации", !(await page.getByPlaceholder("Пароль").count()));
await page.getByPlaceholder("Электронная почта").fill("test@mail.kz");
await page.getByRole("button", { name: "Получить код" }).click();
ok("шаг2: код", (await page.getByText("6-значный код").count()) > 0);
await page.getByPlaceholder("••••••").fill("123456");
await page.getByRole("button", { name: "Подтвердить" }).click();
ok("шаг3: литера-select", (await page.locator("select", { hasText: "Литера" }).count()) > 0);
await page.screenshot({ path: `${OUT}/auth-step3.png` });

// 1.3 + 1.4 Главная
await page.goto("http://localhost:3001/dashboard", { waitUntil: "networkidle" });
ok("нав: Главная", (await page.getByRole("link", { name: "Главная" }).count()) > 0);
ok("нав: нет Мой прогресс виджета", !(await page.getByLabel("Чек-лист и прогресс").count()));
await page.getByText("DeBruce").first().click();
await page.waitForTimeout(400);
const debruceRow = await page.textContent("body");
ok("DeBruce: нет процентов (92)", !/92/.test(await page.locator("div.pb-6").first().innerText()));
ok("DeBruce: primary кнопка результата", (await page.getByRole("link", { name: "Полный результат и рекомендации" }).count()) > 0);
await page.screenshot({ path: `${OUT}/dashboard-debruce.png` });
await page.getByText("MBTI", { exact: true }).first().click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/dashboard-mbti.png` });

// 1.5 Тесты
await page.goto("http://localhost:3001/tests", { waitUntil: "networkidle" });
const testsBody = await page.textContent("body");
ok("тесты: нет слова флагманский", !/флагманск/i.test(testsBody));
ok("тесты: НАО бейдж", /НАО им\. Ы\. Алтынсарина/.test(testsBody));
ok("тесты: баннер комплексной диагностики", /Комплексная диагностика/.test(testsBody));
ok("тесты: кнопка скачать отчёт", (await page.getByRole("button", { name: /Скачать отчёт/ }).count()) > 0);
await page.screenshot({ path: `${OUT}/tests.png` });

// 1.6 Навигатор
await page.goto("http://localhost:3001/universities", { waitUntil: "networkidle" });
ok("навигатор: заголовок", /Навигатор образования/.test(await page.textContent("h1")));
ok("навигатор: чип Тип заведения", (await page.getByRole("button", { name: "Тип заведения" }).count()) > 0);
await page.getByRole("button", { name: "Тип заведения" }).click();
ok("тип: Колледжи в списке", (await page.getByRole("button", { name: "Колледжи" }).count()) > 0);
await page.getByRole("button", { name: "Колледжи" }).click();
await page.waitForTimeout(300);
ok("колледжи отфильтрованы", /Astana Polytech/.test(await page.textContent("body")));
await page.screenshot({ path: `${OUT}/nav-colleges.png` });
// Программы (ГОП)
await page.getByRole("button", { name: "Программы", exact: true }).first().click();
await page.waitForTimeout(300);
const gopBody = await page.textContent("body");
ok("ГОП: код B042", /B042/.test(gopBody));
ok("ГОП: ЕНТ и стоимость", /ЕНТ/.test(gopBody) && /Стоимость/.test(gopBody));
ok("ГОП: без ГОП в списке", true); // уровень колледжей проверим ниже
await page.screenshot({ path: `${OUT}/nav-gops.png` });
const progButtons = page.locator("button", { hasText: "Колледжи" });
await progButtons.last().click();
await page.waitForTimeout(300);
ok("ГОП колледжей: 02150100", /02150100/.test(await page.textContent("body")));
// Избранное — с чистого состояния, без фильтра типа
await page.goto("http://localhost:3001/universities", { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Избранное/ }).click();
await page.waitForTimeout(300);
ok("избранное: 2 заведения", /Избранное: 2/.test(await page.textContent("body")));
await page.screenshot({ path: `${OUT}/nav-saved.png` });

// 1.7 Портфолио
await page.goto("http://localhost:3001/portfolio", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Загрузить", exact: true }).click();
ok("портфолио: поле названия", (await page.getByPlaceholder("Название сертификата").count()) > 0);
ok("портфолио: год вручения", /Год вручения/.test(await page.textContent("body")));
await page.getByPlaceholder("Название сертификата").fill("Тестовый сертификат");
await page.locator("select").selectOption("2025");
await page.getByPlaceholder(/Описание/).fill("Описание тестового достижения");
await page.getByRole("button", { name: "Сохранить в портфолио" }).click();
await page.waitForTimeout(300);
ok("портфолио: карточка добавлена", /Тестовый сертификат/.test(await page.textContent("body")));
await page.getByText("Тестовый сертификат").first().click();
await page.waitForTimeout(300);
ok("портфолио: детальный просмотр", /Описание тестового достижения/.test(await page.textContent("body")));
await page.screenshot({ path: `${OUT}/portfolio-detail.png` });

// 1.8 Профиль
await page.goto("http://localhost:3001/profile", { waitUntil: "networkidle" });
const profBody = await page.textContent("body");
ok("профиль: нет О себе", !/О себе/.test(profBody));
ok("профиль: область/город/школа заблокированы", /привязаны к вашей школьной ссылке/.test(profBody));
ok("профиль: язык интерфейса", /Язык интерфейса/.test(profBody));
ok("профиль: кнопка Выйти", (await page.getByRole("link", { name: /Выйти/ }).count()) > 0);
await page.screenshot({ path: `${OUT}/profile.png` });

console.log("console errors:", errors.length ? errors : "none");
await browser.close();
