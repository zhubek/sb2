import { withPublishedContent } from "@/lib/cms/server";

import { getCopy } from "@/lib/cms/server";

import { ContentText } from "@/lib/cms/client";
import { getContent } from "@/lib/cms/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompassArt } from "@/components/brand-art";
import ReportButton from "@/components/report-button";
import ReportPreview from "@/components/report-preview";
import { skills, universities } from "@/lib/mock-data";
import { eduPrograms, teacherStudents } from "@/lib/teacher-mock-data";

const cmsDefaults_skills = skills;
const cmsDefaults_universities = universities;
const cmsDefaults_eduPrograms = eduPrograms;
const cmsDefaults_teacherStudents = teacherStudents;

async function StudentCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const pageCopy = getCopy("copy.app.teacher.panel.analytics.student.id.page");
  const teacherStudents = getContent("teacher-mock-data.teacherStudents", cmsDefaults_teacherStudents);
  const skills = getContent("mock-data.skills", cmsDefaults_skills);
  const universities = getContent("mock-data.universities", cmsDefaults_universities);
  const eduPrograms = getContent("teacher-mock-data.eduPrograms", cmsDefaults_eduPrograms);
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
          <ContentText id="copy.app.teacher.panel.analytics.student.id.page.001" fallback="Школа" /></Link>
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
              <ContentText id="copy.app.teacher.panel.analytics.student.id.page.002" fallback="Аналитика · уровень «Ученик»" /></p>
            <h1 className="text-2xl font-bold">{st.name}</h1>
            <p className="text-slate-500">
              {st.className} <ContentText id="copy.app.teacher.panel.analytics.student.id.page.003" fallback=" · активность: " />{st.lastActive} <ContentText id="copy.app.teacher.panel.analytics.student.id.page.004" fallback=" · тестов:" />{" "}
              {st.testsPassed}/3
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/teacher/assistant"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <ContentText id="copy.app.teacher.panel.analytics.student.id.page.005" fallback="🤖 Спросить AI об ученике" /></Link>
          <ReportPreview
            title={`Отчёт по ученику · ${st.name}`}
            rows={[
              { label: pageCopy("x001","Класс"), value: st.className },
              { label: pageCopy("x002","Пройдено тестов"), value: `${st.testsPassed}/3` },
              { label: "MBTI", value: st.mbti ?? "—" },
              { label: pageCopy("x003","Ведущая отрасль"), value: st.topIndustry ?? "—" },
              { label: pageCopy("x004","Последняя активность"), value: st.lastActive },
            ]}
          />
          <ReportButton label={pageCopy("x005","Скачать отчёт")} />
        </div>
      </div>

      {noTests ? (
        // Состояние пустых данных (ТЗ 8.2)
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <CompassArt tone="teal" className="mx-auto h-36 w-36" />
          <h2 className="mt-3 font-semibold"><ContentText id="copy.app.teacher.panel.analytics.student.id.page.006" fallback="Диагностика не начата" /></h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            <ContentText id="copy.app.teacher.panel.analytics.student.id.page.007" fallback="Ученик зарегистрирован, но ещё не прошёл ни одного теста. Порекомендуйте начать с теста DeBruce — уже после него появятся первые результаты и рекомендации." /></p>
          <Link
            href="/teacher/assistant"
            className="mt-5 inline-block rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            <ContentText id="copy.app.teacher.panel.analytics.student.id.page.008" fallback="Спросить AI, как вовлечь ученика" /></Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Результаты тестов */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold"><ContentText id="copy.app.teacher.panel.analytics.student.id.page.009" fallback="Результаты тестов" /></h2>
              <div className="mt-4 space-y-5">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    <ContentText id="copy.app.teacher.panel.analytics.student.id.page.010" fallback="DeBruce · топ-навыки" /></p>
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
                      <p className="mt-1 text-sm text-slate-500"><ContentText id="copy.app.teacher.panel.analytics.student.id.page.011" fallback="Не пройден" /></p>
                    )}
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-400">
                      <ContentText id="copy.app.teacher.panel.analytics.student.id.page.012" fallback="Голланд" /></p>
                    {st.hollandTop ? (
                      <p className="mt-1 text-sm font-semibold">
                        {st.hollandTop} <ContentText id="copy.app.teacher.panel.analytics.student.id.page.013" fallback=" тип" /></p>
                    ) : (
                      <p className="mt-1 text-sm text-slate-500"><ContentText id="copy.app.teacher.panel.analytics.student.id.page.014" fallback="Не пройден" /></p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Рекомендации AI */}
            <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
              <h2 className="font-semibold"><ContentText id="copy.app.teacher.panel.analytics.student.id.page.015" fallback="Рекомендации AI" /></h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {st.testsPassed === 3
                  ? `Профиль полный. Сильные стороны (${st.topSkills.join(", ").toLowerCase()}) устойчиво указывают на направление «${st.topIndustry}». Рекомендуется консультация по выбору образовательной программы и знакомство с профильными вузами.`
                  : `Ученик прошёл ${st.testsPassed} из 3 тестов. Предварительное направление — «${st.topIndustry}». Для комплексного отчёта рекомендуется завершить оставшиеся тесты; на консультации обсудите первые результаты и мотивацию.`}
              </p>
            </section>

            {/* Подходящие профессии и направления */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold">
                <ContentText id="copy.app.teacher.panel.analytics.student.id.page.016" fallback="Подходящие профессии и направления" /></h2>
              <p className="mt-1 text-sm text-slate-500">
                <ContentText id="copy.app.teacher.panel.analytics.student.id.page.017" fallback="Отрасль: " />{st.topIndustry}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(st.topIndustry === "Культура и искусство"
                  ? [pageCopy("x006","PR-менеджер"), pageCopy("x007","Журналист"), pageCopy("x008","SMM-специалист"), pageCopy("x009","Дизайнер")]
                  : st.topIndustry === "IT и телекоммуникации"
                    ? [pageCopy("x010","Разработчик ПО"), pageCopy("x011","Аналитик данных"), pageCopy("x012","DevOps-инженер")]
                    : st.topIndustry === "Инженерия"
                      ? [pageCopy("x013","Инженер-механик"), pageCopy("x014","Робототехник"), pageCopy("x015","Энергетик")]
                      : [pageCopy("x016","Менеджер проектов"), pageCopy("x017","Финансовый аналитик"), pageCopy("x018","Экономист")]
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
              <h2 className="font-semibold"><ContentText id="copy.app.teacher.panel.analytics.student.id.page.018" fallback="Избранные учеником" /></h2>
              <p className="mt-1 text-sm text-slate-500">
                <ContentText id="copy.app.teacher.panel.analytics.student.id.page.019" fallback="Вузы, которые ученик добавил в Избранное на своей платформе" /></p>
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
                            {u!.city} <ContentText id="copy.app.teacher.panel.analytics.student.id.page.020" fallback=" · балл от " />{u!.minScore}
                          </p>
                        </div>
                        <span className="text-slate-300">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-400">
                  <ContentText id="copy.app.teacher.panel.analytics.student.id.page.021" fallback="Ученик пока не добавил вузы в Избранное" /></p>
              )}
            </section>

            {/* Избранные образовательные программы */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold"><ContentText id="copy.app.teacher.panel.analytics.student.id.page.022" fallback="Избранные ОП" /></h2>
              <p className="mt-1 text-sm text-slate-500">
                <ContentText id="copy.app.teacher.panel.analytics.student.id.page.023" fallback="Образовательные программы из Избранного ученика" /></p>
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
                  <ContentText id="copy.app.teacher.panel.analytics.student.id.page.024" fallback="Ученик пока не добавил программы в Избранное" /></p>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            {/* История прохождения */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold"><ContentText id="copy.app.teacher.panel.analytics.student.id.page.025" fallback="История прохождения" /></h2>
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
                      <span><ContentText id="copy.app.teacher.panel.analytics.student.id.page.026" fallback="DeBruce (1-я попытка)" /></span>
                      <span>03.03.2026</span>
                    </li>
                  </>
                )}
                {st.testsPassed === 3 && (
                  <li className="flex justify-between">
                    <span><ContentText id="copy.app.teacher.panel.analytics.student.id.page.027" fallback="Голланд" /></span>
                    <span className="text-slate-400">16.07.2026</span>
                  </li>
                )}
              </ul>
            </section>

            {/* Портфолио */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold"><ContentText id="copy.app.teacher.panel.analytics.student.id.page.028" fallback="Портфолио" /></h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li><ContentText id="copy.app.teacher.panel.analytics.student.id.page.029" fallback="🏆 Диплом — олимпиада по литературе" /></li>
                <li><ContentText id="copy.app.teacher.panel.analytics.student.id.page.030" fallback="📜 Сертификат — курс «Основы SMM»" /></li>
              </ul>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}

export default withPublishedContent(StudentCardPage);
