import { withPublishedContent } from "@/lib/cms/server";

import { ContentText } from "@/lib/cms/client";
import { getContent } from "@/lib/cms/server";
import Link from "next/link";
import AnalyticsTabs from "@/components/analytics-tabs";
import { schoolClasses, teacher } from "@/lib/teacher-mock-data";

const cmsDefaults_schoolClasses = schoolClasses;
const cmsDefaults_teacher = teacher;

function ClassesAnalyticsPage() {
  const teacher = getContent("teacher-mock-data.teacher", cmsDefaults_teacher);
  const schoolClasses = getContent("teacher-mock-data.schoolClasses", cmsDefaults_schoolClasses);
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm text-slate-400"><ContentText id="copy.app.teacher.panel.analytics.classes.page.001" fallback="Аналитика · уровень «Классы»" /></p>
        <h1 className="mt-0.5 text-2xl font-bold"><ContentText id="copy.app.teacher.panel.analytics.classes.page.002" fallback="Классы" /></h1>
        <p className="mt-1 text-slate-500">
          {teacher.school} · {schoolClasses.length} <ContentText id="copy.app.teacher.panel.analytics.classes.page.003" fallback=" классов на платформе" /></p>
      </div>

      <AnalyticsTabs />

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold"><ContentText id="copy.app.teacher.panel.analytics.classes.page.004" fallback="Список классов" /></h2>
        <p className="text-sm text-slate-500">
          <ContentText id="copy.app.teacher.panel.analytics.classes.page.005" fallback="Основные метрики · перейдите в класс для полной аналитики и списка учеников" /></p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                <th className="py-2.5 pr-4 font-medium"><ContentText id="copy.app.teacher.panel.analytics.classes.page.006" fallback="Класс" /></th>
                <th className="py-2.5 pr-4 font-medium"><ContentText id="copy.app.teacher.panel.analytics.classes.page.007" fallback="Учеников" /></th>
                <th className="py-2.5 pr-4 font-medium"><ContentText id="copy.app.teacher.panel.analytics.classes.page.008" fallback="Начали диагностику" /></th>
                <th className="py-2.5 pr-4 font-medium"><ContentText id="copy.app.teacher.panel.analytics.classes.page.009" fallback="Полные профили (3/3)" /></th>
                <th className="py-2.5 pr-4 font-medium"><ContentText id="copy.app.teacher.panel.analytics.classes.page.010" fallback="Ведущее направление" /></th>
                <th className="py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {schoolClasses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="py-3 pr-4 font-medium">{c.name}</td>
                  <td className="py-3 pr-4 text-slate-600">{c.students}</td>
                  <td className="py-3 pr-4 text-slate-600">
                    {c.tested} ({Math.round((c.tested / c.students) * 100)}%)
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{c.fullProfiles}</td>
                  <td className="py-3 pr-4 text-slate-600">{c.topDirection}</td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/teacher/analytics/class/${c.id}`}
                      className="text-sm font-medium text-teal-600 hover:text-teal-700"
                    >
                      <ContentText id="copy.app.teacher.panel.analytics.classes.page.011" fallback="Открыть →" /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default withPublishedContent(ClassesAnalyticsPage);
