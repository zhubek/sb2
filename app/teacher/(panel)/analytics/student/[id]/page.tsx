import Link from "next/link";
import { notFound } from "next/navigation";
import { CompassArt } from "@/components/brand-art";
import ReportButton from "@/components/report-button";
import ReportPreview from "@/components/report-preview";
import { skills, universities } from "@/lib/mock-data";
import { eduPrograms, teacherStudents } from "@/lib/teacher-mock-data";

export default async function StudentCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const st = teacherStudents.find((s) => s.id === id);
  if (!st) notFound();

  const noTests = st.testsPassed === 0;
  // Мок: полный профиль навыков показываем из общего набора DeBruce
  const skillRows = st.topSkills.length
    ? st.topSkills
        .map((name) => skills.find((s) => s.name === name))
        .filter(Boolean)
    : [];
  // Избранное ученика: вузы и образовательные программы из его профиля
  const favoriteUnis = st.favoriteUniversities
    .map((uid) => universities.find((u) => u.id === uid))
    .filter(Boolean);
  const favoritePrograms = st.favoritePrograms
    .map((pid) => eduPrograms.find((p) => p.id === pid))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/teacher/analytics" className="hover:text-slate-600">
          Школа
        </Link>
        <span>/</span>
        <Link
          href={`/teacher/analytics/class/${st.classId}`}
          className="hover:text-slate-600"
        >
          {st.className}
        </Link>
        <span>/</span>
        <span className="text-slate-600">{st.name}</span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-100 text-lg font-bold text-teal-700">
            {st.name.split(" ").map((w) => w[0])}
          </div>
          <div>
            <p className="text-sm text-slate-400">
              Аналитика · уровень «Ученик»
            </p>
            <h1 className="text-2xl font-bold">{st.name}</h1>
            <p className="text-slate-500">
              {st.className} · активность: {st.lastActive} · тестов:{" "}
              {st.testsPassed}/3
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/teacher/assistant"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            🤖 Спросить AI об ученике
          </Link>
          <ReportPreview
            title={`Отчёт по ученику · ${st.name}`}
            rows={[
              { label: "Класс", value: st.className },
              { label: "Пройдено тестов", value: `${st.testsPassed}/3` },
              { label: "MBTI", value: st.mbti ?? "—" },
              { label: "Ведущая отрасль", value: st.topIndustry ?? "—" },
              { label: "Последняя активность", value: st.lastActive },
            ]}
          />
          <ReportButton label="Скачать отчёт" />
        </div>
      </div>

      {noTests ? (
        // Состояние пустых данных (ТЗ 8.2)
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <CompassArt tone="teal" className="mx-auto h-36 w-36" />
          <h2 className="mt-3 font-semibold">Диагностика не начата</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Ученик зарегистрирован, но ещё не прошёл ни одного теста.
            Порекомендуйте начать с теста DeBruce — уже после него
            появятся первые результаты и рекомендации.
          </p>
          <Link
            href="/teacher/assistant"
            className="mt-5 inline-block rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            Спросить AI, как вовлечь ученика
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Результаты тестов */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold">Результаты тестов</h2>
              <div className="mt-4 space-y-5">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    DeBruce · топ-навыки
                  </p>
                  <div className="mt-2.5 space-y-3">
                    {skillRows.map((s) => (
                      <div key={s!.id}>
                        <div className="flex justify-between text-sm">
                          <span>{s!.name}</span>
                          <span className="font-medium text-slate-500">
                            {s!.score}
                          </span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-teal-600"
                            style={{ width: `${s!.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-400">MBTI</p>
                    {st.mbti ? (
                      <p className="mt-1 text-xl font-bold text-teal-600">
                        {st.mbti}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-slate-500">Не пройден</p>
                    )}
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-400">
                      Голланд
                    </p>
                    {st.hollandTop ? (
                      <p className="mt-1 text-sm font-semibold">
                        {st.hollandTop} тип
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-slate-500">Не пройден</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Рекомендации AI */}
            <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
              <h2 className="font-semibold">Рекомендации AI</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {st.testsPassed === 3
                  ? `Профиль полный. Сильные стороны (${st.topSkills.join(", ").toLowerCase()}) устойчиво указывают на направление «${st.topIndustry}». Рекомендуется консультация по выбору образовательной программы и знакомство с профильными вузами.`
                  : `Ученик прошёл ${st.testsPassed} из 3 тестов. Предварительное направление — «${st.topIndustry}». Для комплексного отчёта рекомендуется завершить оставшиеся тесты; на консультации обсудите первые результаты и мотивацию.`}
              </p>
            </section>

            {/* Подходящие профессии и направления */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold">
                Подходящие профессии и направления
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Отрасль: {st.topIndustry}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(st.topIndustry === "Культура и искусство"
                  ? ["PR-менеджер", "Журналист", "SMM-специалист", "Дизайнер"]
                  : st.topIndustry === "IT и телекоммуникации"
                    ? ["Разработчик ПО", "Аналитик данных", "DevOps-инженер"]
                    : st.topIndustry === "Инженерия"
                      ? ["Инженер-механик", "Робототехник", "Энергетик"]
                      : ["Менеджер проектов", "Финансовый аналитик", "Экономист"]
                ).map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </section>

            {/* Вузы, добавленные учеником в Избранное */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold">Избранные учеником</h2>
              <p className="mt-1 text-sm text-slate-500">
                Вузы, которые ученик добавил в Избранное на своей платформе
              </p>
              {favoriteUnis.length > 0 ? (
                <ul className="mt-4 space-y-2.5">
                  {favoriteUnis.map((u) => (
                    <li key={u!.id}>
                      <Link
                        href={`/teacher/handbook/university/${u!.id}`}
                        className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 transition hover:border-teal-200 hover:bg-teal-50/40"
                      >
                        <div>
                          <p className="text-sm font-medium">{u!.name}</p>
                          <p className="text-xs text-slate-400">
                            {u!.city} · балл от {u!.minScore}
                          </p>
                        </div>
                        <span className="text-slate-300">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-400">
                  Ученик пока не добавил вузы в Избранное
                </p>
              )}
            </section>

            {/* Избранные образовательные программы */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold">Избранные ОП</h2>
              <p className="mt-1 text-sm text-slate-500">
                Образовательные программы из Избранного ученика
              </p>
              {favoritePrograms.length > 0 ? (
                <ul className="mt-4 space-y-2.5">
                  {favoritePrograms.map((p) => (
                    <li
                      key={p!.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3"
                    >
                      <span className="rounded-lg bg-teal-50 px-2.5 py-1 font-mono text-xs font-medium text-teal-700">
                        {p!.code}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{p!.name}</p>
                        <p className="text-xs text-slate-400">{p!.direction}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-400">
                  Ученик пока не добавил программы в Избранное
                </p>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            {/* История прохождения */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold">История прохождения</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {st.testsPassed >= 2 && (
                  <li className="flex justify-between">
                    <span>MBTI</span>
                    <span className="text-slate-400">14.07.2026</span>
                  </li>
                )}
                {st.testsPassed >= 1 && (
                  <>
                    <li className="flex justify-between">
                      <span>DeBruce</span>
                      <span className="text-slate-400">12.07.2026</span>
                    </li>
                    <li className="flex justify-between text-slate-400">
                      <span>DeBruce (1-я попытка)</span>
                      <span>03.03.2026</span>
                    </li>
                  </>
                )}
                {st.testsPassed === 3 && (
                  <li className="flex justify-between">
                    <span>Голланд</span>
                    <span className="text-slate-400">16.07.2026</span>
                  </li>
                )}
              </ul>
            </section>

            {/* Портфолио */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold">Портфолио</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>🏆 Диплом — олимпиада по литературе</li>
                <li>📜 Сертификат — курс «Основы SMM»</li>
              </ul>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
