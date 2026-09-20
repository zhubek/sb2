"use client";
import { ContentText } from "@/lib/cms/client";
import { useContent } from "@/lib/cms/client";


import { ChevronDown, Compass, Download } from "lucide-react";
import { useState } from "react";
import { ONBOARDING_RESTART } from "@/components/teacher-onboarding";
import {
  studentGuides,
  trainingFaq,
  trainingGuides,
  trainingVideos,
} from "@/lib/teacher-mock-data";

const cmsDefaults_trainingVideos=trainingVideos;
const cmsDefaults_studentGuides = studentGuides;
const cmsDefaults_trainingFaq = trainingFaq;
const cmsDefaults_trainingGuides = trainingGuides;

export default function GuidePage() {
  const trainingVideos=useContent("teacher-mock-data.trainingVideos",cmsDefaults_trainingVideos);
  const trainingGuides = useContent("teacher-mock-data.trainingGuides", cmsDefaults_trainingGuides);
  const studentGuides = useContent("teacher-mock-data.studentGuides", cmsDefaults_studentGuides);
  const trainingFaq = useContent("teacher-mock-data.trainingFaq", cmsDefaults_trainingFaq);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          <ContentText id="copy.app.teacher.panel.guide.page.001" fallback="Руководство" /></h1>
        <p className="mt-1 text-slate-500">
          <ContentText id="copy.app.teacher.panel.guide.page.002" fallback="Гайды по работе с платформой, ответы на частые вопросы и материалы о платформе ученика" /></p>
      </div>

      {/* Интерактивный онбординг */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-teal-200 bg-teal-50/60 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
            <Compass size={18} />
          </span>
          <div>
            <p className="font-semibold"><ContentText id="copy.app.teacher.panel.guide.page.003" fallback="Интерактивный онбординг" /></p>
            <p className="text-sm text-slate-600">
              <ContentText id="copy.app.teacher.panel.guide.page.004" fallback="Экскурсия по основным разделам платформы за 5 шагов" /></p>
          </div>
        </div>
        <button
          onClick={() => window.dispatchEvent(new Event(ONBOARDING_RESTART))}
          className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
        >
          <ContentText id="copy.app.teacher.panel.guide.page.005" fallback="Запустить онбординг" /></button>
      </section>

      {/* Гайды по платформе профориентатора */}
      <section id="training-guides" className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold"><ContentText id="copy.app.teacher.panel.guide.page.006" fallback="Гайды по работе с платформой" /></h2>
        <ul className="mt-3 divide-y divide-slate-100">
          {trainingGuides.map((g) => (
            <li key={g.id} className="flex items-center gap-3 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-base">
                {g.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{g.title}</p>
                <p className="truncate text-xs text-slate-500">{g.desc}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-slate-400">
                {g.length}
              </span>
              <button className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:border-teal-600 hover:text-teal-700">
                <Download size={13} />
                <ContentText id="copy.app.teacher.panel.guide.page.007" fallback="Открыть" /></button>
            </li>
          ))}
        </ul>
      </section>

      {/* Гайды по платформе ученика */}
      <section id="student-guides" className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold"><ContentText id="copy.app.teacher.panel.guide.page.008" fallback="Платформа ученика" /></h2>
        <p className="text-sm text-slate-500">
          <ContentText id="copy.app.teacher.panel.guide.page.009" fallback="Материалы, чтобы помогать ученикам осваивать их часть платформы" /></p>
        <ul className="mt-3 divide-y divide-slate-100">
          {studentGuides.map((g) => (
            <li key={g.id} className="flex items-center gap-3 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-base">
                {g.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{g.title}</p>
                <p className="truncate text-xs text-slate-500">{g.desc}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-slate-400">
                {g.length}
              </span>
              <button className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:border-teal-600 hover:text-teal-700">
                <Download size={13} />
                <ContentText id="copy.app.teacher.panel.guide.page.010" fallback="Открыть" /></button>
            </li>
          ))}
        </ul>
      </section>

      <section id="training-videos" className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Обучающие видео</h2>
        <ul className="mt-3 divide-y divide-slate-100">{trainingVideos.map(video=><li key={video.id} className="flex items-center justify-between gap-4 py-4"><div><p className="text-sm font-medium">{video.title}</p><p className="mt-1 text-xs text-slate-500">Видео готовится к публикации</p></div><span className="font-mono text-xs text-slate-400">{video.duration}</span></li>)}</ul>
      </section>

      {/* Частые вопросы */}
      <section id="training-faq" className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold"><ContentText id="copy.app.teacher.panel.guide.page.011" fallback="Часто задаваемые вопросы" /></h2>
        <ul className="mt-2 divide-y divide-slate-100">
          {trainingFaq.map((f, i) => (
            <li key={f.q}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
              >
                <span className="text-sm font-medium">{f.q}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-slate-400 transition ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === i && (
                <p className="pb-4 text-sm leading-relaxed text-slate-600">
                  {f.a}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
