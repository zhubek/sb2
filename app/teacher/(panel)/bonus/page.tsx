"use client";
import { useCopy } from "@/lib/cms/client";

import { ContentText } from "@/lib/cms/client";
import { useContent } from "@/lib/cms/client";


import { ChevronDown, Info, Sparkles, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import {
  apiSafe,
  backendUserId,
  type ApiOrgLog,
  type ApiOrgPoints,
  type ApiUser,
} from "@/lib/api";
import {
  bonusTransactions,
  coverageProgress,
  decidedStudents,
  type LeaderPeriod,
  leaderPeriodLabels,
  leaderboards,
  pointsRules,
  season,
  seasonPoints,
  teacherBadges,
} from "@/lib/teacher-mock-data";

const cmsDefaults_bonusTransactions = bonusTransactions;
const cmsDefaults_coverageProgress = coverageProgress;
const cmsDefaults_decidedStudents = decidedStudents;
const cmsDefaults_leaderPeriodLabels = leaderPeriodLabels;
const cmsDefaults_leaderboards = leaderboards;
const cmsDefaults_pointsRules = pointsRules;
const cmsDefaults_season = season;
const cmsDefaults_seasonPoints = seasonPoints;
const cmsDefaults_teacherBadges = teacherBadges;

export default function BonusPage() {
  const pageCopy = useCopy("copy.app.teacher.panel.bonus.page");
  const bonusTransactions = useContent("teacher-mock-data.bonusTransactions", cmsDefaults_bonusTransactions);
  const seasonPoints = useContent("teacher-mock-data.seasonPoints", cmsDefaults_seasonPoints);
  const teacherBadges = useContent("teacher-mock-data.teacherBadges", cmsDefaults_teacherBadges);
  const leaderboards = useContent("teacher-mock-data.leaderboards", cmsDefaults_leaderboards);
  const decidedStudents = useContent("teacher-mock-data.decidedStudents", cmsDefaults_decidedStudents);
  const season = useContent("teacher-mock-data.season", cmsDefaults_season);
  const leaderPeriodLabels = useContent("teacher-mock-data.leaderPeriodLabels", cmsDefaults_leaderPeriodLabels);
  const coverageProgress = useContent("teacher-mock-data.coverageProgress", cmsDefaults_coverageProgress);
  const pointsRules = useContent("teacher-mock-data.pointsRules", cmsDefaults_pointsRules);
  const [openRule, setOpenRule] = useState<string | null>("students");
  const [league, setLeague] = useState<"urban" | "rural">("urban");
  const [period, setPeriod] = useState<LeaderPeriod>("all");
  const [showAllTx, setShowAllTx] = useState(false);
  // Живые данные бекенда; до загрузки (или без API) — мок-значения
  const [apiPoints, setApiPoints] = useState<ApiOrgPoints | null>(null);
  const [apiTx, setApiTx] = useState<typeof bonusTransactions | null>(null);

  useEffect(() => {
    (async () => {
      const uid = await backendUserId();
      if (!uid) return;
      const me = await apiSafe<ApiUser>(`/users/${uid}`);
      if (!me?.organizationId) return;
      const [points, logs] = await Promise.all([
        apiSafe<ApiOrgPoints>(`/organizations/${me.organizationId}/points`),
        apiSafe<ApiOrgLog[]>(`/users/${uid}/org-logs`),
      ]);
      if (points) setApiPoints(points);
      if (logs?.length)
        setApiTx(
          logs.map((l) => ({
            id: `api-${l.id}`,
            reason: l.text ?? l.orgLogType.name,
            points: l.orgLogType.point,
            date: new Date(l.dateTime)
              .toLocaleString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
              .replace(", ", " · "),
          }))
        );
    })();
  }, []);

  const blockGroups: Record<string, string> = {
    "Ученики": "STUDENTS",
    "Охват школы": "REACH",
    "Отчёты": "REPORT",
    "Обучение": "LEARN",
    "Регулярность": "CONSISTENCY",
  };
  const totalPoints = apiPoints?.total ?? seasonPoints.total;
  const byBlock = seasonPoints.byBlock.map((b) => ({
    ...b,
    points: apiPoints
      ? (apiPoints.byGroup[blockGroups[b.block]] ?? 0)
      : b.points,
  }));

  const earned = teacherBadges.filter((b) => b.earned);
  const ownRank =
    [...leaderboards.urban]
      .sort((a, b) => b.points.all - a.points.all)
      .findIndex((r) => r.own) + 1;
  const rows = [...leaderboards[league]].sort(
    (a, b) => b.points[period] - a.points[period]
  );
  const txAll = apiTx ?? bonusTransactions;
  const tx = showAllTx ? txAll : txAll.slice(0, 6);
  const decidedPct = Math.round((decidedStudents.count / decidedStudents.of) * 100);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            <ContentText id="copy.app.teacher.panel.bonus.page.001" fallback="Баллы и достижения" /></h1>
          <p className="mt-1 text-slate-500">
            {season.label} · {season.period}
          </p>
        </div>
        <span className="rounded-full bg-teal-50 px-3.5 py-1.5 text-xs font-medium text-teal-700">
          <ContentText id="copy.app.teacher.panel.bonus.page.002" fallback="Награждение — в мае" /></span>
      </div>

      {/* Сводка сезона */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <p className="flex items-center gap-1.5 text-xs tracking-wider text-slate-400 uppercase">
            <Sparkles size={13} className="text-teal-500" />
            <ContentText id="copy.app.teacher.panel.bonus.page.003" fallback="Баллы за сезон" /></p>
          <p className="font-display mt-1 text-xl font-semibold sm:text-2xl">
            {totalPoints.toLocaleString("ru-RU")}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <p className="flex items-center gap-1.5 text-xs tracking-wider text-slate-400 uppercase">
            <Trophy size={13} className="text-teal-500" />
            <ContentText id="copy.app.teacher.panel.bonus.page.004" fallback="Место в лиге" /></p>
          <p className="font-display mt-1 text-xl font-semibold sm:text-2xl">
            #{ownRank}{" "}
            <span className="text-sm font-normal text-slate-400">
              <ContentText id="copy.app.teacher.panel.bonus.page.005" fallback="городские школы" /></span>
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <p className="text-xs tracking-wider text-slate-400 uppercase">
            <ContentText id="copy.app.teacher.panel.bonus.page.006" fallback="Значки" /></p>
          <p className="font-display mt-1 text-xl font-semibold sm:text-2xl">
            {earned.length}{" "}
            <span className="text-sm font-normal text-slate-400">
              <ContentText id="copy.app.teacher.panel.bonus.page.007" fallback="из " />{teacherBadges.length}
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <p className="flex items-center gap-1.5 text-xs tracking-wider text-slate-400 uppercase">
            <ContentText id="copy.app.teacher.panel.bonus.page.008" fallback="Определились с выбором" /><span className="group relative inline-flex">
              <Info size={13} className="cursor-help text-slate-400 transition group-hover:text-teal-600" />
              {/* Тултип с объяснением метрики */}
              <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-60 -translate-x-1/2 rounded-lg bg-slate-800 px-3 py-2 text-[11px] leading-relaxed font-normal tracking-normal text-white normal-case shadow-lg group-hover:block">
                <ContentText id="copy.app.teacher.panel.bonus.page.009" fallback="Доля учеников, которые после полного цикла диагностики добавили образовательную программу или вуз в избранное — то есть определились с направлением." /></span>
            </span>
          </p>
          <p className="font-display mt-1 text-xl font-semibold sm:text-2xl">
            {decidedPct}%{" "}
            <span className="text-sm font-normal text-slate-400">
              <ContentText id="copy.app.teacher.panel.bonus.page.010" fallback="учеников" /></span>
          </p>
        </div>
      </div>

      {/* Значки */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="font-semibold"><ContentText id="copy.app.teacher.panel.bonus.page.011" fallback="Значки сезона" /></h2>
        <p className="text-sm text-slate-500">
          <ContentText id="copy.app.teacher.panel.bonus.page.012" fallback="Награды за рубежи — отображаются в профиле и рядом с именем в лидерборде. Значок не отзывается задним числом." /></p>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {teacherBadges.map((b) => (
            <div
              key={b.id}
              className={`min-w-0 rounded-xl border p-3 sm:p-4 ${
                b.earned
                  ? "border-teal-200 bg-teal-50/50"
                  : "border-slate-100 opacity-50"
              }`}
            >
              <span className="text-xl sm:text-2xl">{b.icon}</span>
              <p className="mt-1.5 text-[13px] leading-snug font-medium sm:mt-2 sm:text-sm">{b.name}</p>
              <p className="mt-0.5 text-xs leading-snug text-slate-500">
                {b.desc}
              </p>
              <p className="mt-1.5 font-mono text-[11px] text-slate-400">
                {b.earned ? `Получен · ${b.earnedAt}` : pageCopy("x001","Не получен")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Лидерборд */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold"><ContentText id="copy.app.teacher.panel.bonus.page.013" fallback="Лидерборд педагогов" /></h2>
            <p className="text-sm text-slate-500">
              <ContentText id="copy.app.teacher.panel.bonus.page.014" fallback="Городские и сельские школы соревнуются раздельно — это уравнивает шансы" /></p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-xl bg-slate-100 p-1 text-sm font-medium">
              {(
                [
                  ["urban", pageCopy("x002","Городские")],
                  ["rural", pageCopy("x003","Сельские")],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setLeague(key)}
                  className={`rounded-lg px-4 py-1.5 transition ${
                    league === key
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex rounded-xl bg-slate-100 p-1 text-sm font-medium">
              {(Object.keys(leaderPeriodLabels) as LeaderPeriod[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setPeriod(key)}
                  className={`rounded-lg px-4 py-1.5 transition ${
                    period === key
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {leaderPeriodLabels[key]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                <th className="py-2.5 pr-4 font-medium"><ContentText id="copy.app.teacher.panel.bonus.page.015" fallback="Место" /></th>
                <th className="py-2.5 pr-4 font-medium"><ContentText id="copy.app.teacher.panel.bonus.page.016" fallback="Педагог" /></th>
                <th className="hidden py-2.5 pr-4 font-medium sm:table-cell"><ContentText id="copy.app.teacher.panel.bonus.page.017" fallback="Школа" /></th>
                <th className="hidden py-2.5 pr-4 font-medium sm:table-cell"><ContentText id="copy.app.teacher.panel.bonus.page.018" fallback="Значки" /></th>
                <th className="py-2.5 text-right font-medium">
                  <ContentText id="copy.app.teacher.panel.bonus.page.019" fallback="Баллы · " />{leaderPeriodLabels[period].toLowerCase()}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((r, i) => {
                const rank = i + 1;
                return (
                  <tr
                    key={r.name}
                    className={r.own ? "bg-teal-50/60" : "hover:bg-slate-50/60"}
                  >
                    <td className="py-3 pr-3 font-mono whitespace-nowrap text-slate-500 sm:pr-4">
                      {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : `#${rank}`}
                    </td>
                    <td className="py-3 pr-4 font-medium whitespace-nowrap">
                      {r.name}
                      {r.own && (
                        <span className="ml-2 rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-medium text-teal-700">
                          <ContentText id="copy.app.teacher.panel.bonus.page.020" fallback="Вы" /></span>
                      )}
                      <span className="block text-xs font-normal whitespace-normal text-slate-400 sm:hidden">
                        {r.school} · 🏅 {r.badges}
                      </span>
                    </td>
                    <td className="hidden py-3 pr-4 text-slate-500 sm:table-cell">{r.school}</td>
                    <td className="hidden py-3 pr-4 font-mono text-xs text-slate-500 sm:table-cell">
                      🏅 {r.badges}
                    </td>
                    <td className="py-3 text-right font-mono font-medium">
                      {r.points[period].toLocaleString("ru-RU")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
          {season.note}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Баллы по блокам + охват */}
        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-2">
          <h2 className="font-semibold"><ContentText id="copy.app.teacher.panel.bonus.page.021" fallback="Баллы по блокам" /></h2>
          <ul className="mt-4 space-y-3.5">
            {byBlock.map((b) => (
              <li key={b.block}>
                <div className="flex items-baseline justify-between text-sm">
                  <span>{b.block}</span>
                  <span className="font-mono text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">
                      {b.points.toLocaleString("ru-RU")}
                    </span>
                    {b.max ? ` / ${b.max}` : ""}
                  </span>
                </div>
                {b.max && (
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-teal-600"
                      style={{ width: `${Math.min(100, (b.points / b.max) * 100)}%` }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Охват школы с вехами */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold"><ContentText id="copy.app.teacher.panel.bonus.page.022" fallback="Охват школы" /></h3>
              <span className="font-mono text-xs text-slate-500">
                {coverageProgress.pct}<ContentText id="copy.app.teacher.panel.bonus.page.023" fallback="% · след. веха 90%" /></span>
            </div>
            <div className="relative mt-3 h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-600"
                style={{ width: `${coverageProgress.pct}%` }}
              />
              {coverageProgress.thresholds.map((t) => (
                <span
                  key={t.pct}
                  className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white ${
                    t.done ? "bg-teal-600" : "bg-slate-300"
                  }`}
                  style={{ left: `${t.pct}%` }}
                  title={`${t.pct}% · ${t.label}`}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-slate-400">
              {coverageProgress.thresholds.map((t) => (
                <span key={t.pct} className={t.done ? "text-teal-600" : ""}>
                  {t.pct}%
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* История начислений */}
        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-3">
          <h2 className="font-semibold"><ContentText id="copy.app.teacher.panel.bonus.page.024" fallback="История начислений" /></h2>
          <p className="text-sm text-slate-500">
            <ContentText id="copy.app.teacher.panel.bonus.page.025" fallback="Начисляется только то, что платформа фиксирует автоматически" /></p>
          <ul className="mt-3 divide-y divide-slate-100">
            {tx.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm">{t.reason}</p>
                  <p className="font-mono text-xs text-slate-400">{t.date}</p>
                </div>
                <span className="shrink-0 font-mono text-sm font-medium text-emerald-600">
                  +{t.points}
                </span>
              </li>
            ))}
          </ul>
          {txAll.length > 6 && (
            <button
              onClick={() => setShowAllTx(!showAllTx)}
              className="mt-3 w-full border-t border-slate-100 pt-3 text-center text-xs font-medium text-teal-600 transition hover:text-teal-700"
            >
              {showAllTx
                ? pageCopy("x004","Свернуть")
                : `Показать все · ${txAll.length}`}
            </button>
          )}
        </section>
      </div>

      {/* Правила начисления */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="font-semibold"><ContentText id="copy.app.teacher.panel.bonus.page.026" fallback="За что начисляются баллы" /></h2>
        <p className="text-sm text-slate-500">
          <ContentText id="copy.app.teacher.panel.bonus.page.027" fallback="Пять блоков; начисления за ученика — раз в сезон" /></p>
        <div className="mt-4 space-y-2">
          {pointsRules.map((r) => {
            const open = openRule === r.id;
            return (
              <div key={r.id} className="rounded-xl border border-slate-100">
                <button
                  onClick={() => setOpenRule(open ? null : r.id)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                >
                  <span className="text-lg">{r.icon}</span>
                  <span className="flex-1 text-sm font-medium">{r.block}</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <div className="border-t border-slate-100 px-4 py-4">
                    <ul className="divide-y divide-slate-50">
                      {r.items.map((i) => (
                        <li
                          key={i.action}
                          className="flex items-center justify-between gap-4 py-2.5 text-sm"
                        >
                          <span className="text-slate-600">{i.action}</span>
                          <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-1 font-mono text-xs font-medium text-teal-700">
                            {i.points}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 flex gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-500">
                      <Info size={13} className="mt-0.5 shrink-0" />
                      {r.note}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
