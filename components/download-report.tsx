"use client";
import { useCopy } from "@/lib/cms/client";

import { ContentText } from "@/lib/cms/client";
import { useContent } from "@/lib/cms/client";


import { Download } from "lucide-react";
import {
  currentUser,
  hollandScales,
  mbtiScales,
  skills,
  tests,
} from "@/lib/mock-data";

// Кнопка «Скачать отчёт»: собирает результаты пройденных тестов в SVG-файл
const cmsDefaults_currentUser = currentUser;
const cmsDefaults_hollandScales = hollandScales;
const cmsDefaults_mbtiScales = mbtiScales;
const cmsDefaults_skills = skills;
const cmsDefaults_tests = tests;

export default function DownloadReport() {
  const pageCopy = useCopy("copy.components.download-report");
  const tests = useContent("mock-data.tests", cmsDefaults_tests);
  const skills = useContent("mock-data.skills", cmsDefaults_skills);
  const hollandScales = useContent("mock-data.hollandScales", cmsDefaults_hollandScales);
  const currentUser = useContent("mock-data.currentUser", cmsDefaults_currentUser);
  const mbtiScales = useContent("mock-data.mbtiScales", cmsDefaults_mbtiScales);
  function download() {
    const passed = new Set(tests.filter((t) => t.passed).map((t) => t.id));
    const top3 = skills.slice(0, 3).map((s) => s.name);
    const riasec = [...hollandScales]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.code)
      .join("");

    const lines: string[] = [];
    let y = 150;
    function line(text: string, opts: { bold?: boolean; muted?: boolean } = {}) {
      lines.push(
        `<text x="60" y="${y}" font-family="Arial, sans-serif" font-size="${opts.bold ? 17 : 14}" font-weight="${opts.bold ? 700 : 400}" fill="${opts.muted ? "#6b7288" : "#2a2e3b"}">${text}</text>`
      );
      y += opts.bold ? 34 : 26;
    }

    if (passed.has("debruce")) {
      line(pageCopy("x001","Тест «DeBruce» — топ-3 навыка"), { bold: true });
      top3.forEach((n, i) => line(`${i + 1}. ${n}`));
      y += 14;
    }
    if (passed.has("mbti")) {
      line(pageCopy("x002","Тест MBTI — тип личности"), { bold: true });
      line(`${currentUser.mbtiType} · «${currentUser.mbtiTitle}»`);
      mbtiScales.forEach((s) => line(`${s.left} — ${s.right}: ${s.value}% · ${s.winner}`, { muted: true }));
      y += 14;
    }
    if (passed.has("holland")) {
      line(pageCopy("x003","Тест Голланда — профиль интересов"), { bold: true });
      line(`Код RIASEC: ${riasec}`);
      y += 14;
    } else {
      line(pageCopy("x004","Тест Голланда ещё не пройден — пройдите его,"), { muted: true });
      line(pageCopy("x005","чтобы получить комплексную диагностику."), { muted: true });
    }

    const height = Math.max(y + 60, 560);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="${height}" viewBox="0 0 760 ${height}">
  <rect width="760" height="${height}" fill="#fcfbfd"/>
  <rect x="20" y="20" width="720" height="${height - 40}" rx="24" fill="#ffffff" stroke="#dde0ea"/>
  <circle cx="72" cy="72" r="16" fill="none" stroke="#2a2e3b" stroke-width="3"/>
  <rect x="66" y="66" width="12" height="12" fill="none" stroke="#4a47d1" stroke-width="3" transform="rotate(20 72 72)"/>
  <text x="102" y="78" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#2a2e3b">Отчёт по диагностике</text>
  <text x="60" y="112" font-family="Arial, sans-serif" font-size="14" fill="#6b7288">${currentUser.firstName} ${currentUser.lastName} · ${currentUser.grade} · ${currentUser.school}</text>
  ${lines.join("\n  ")}
</svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "otchet-diagnostika.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={download}
      className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:border-violet-300 hover:text-violet-800"
    >
      <Download size={15} />
      <ContentText id="copy.components.download-report.001" fallback="Скачать отчёт" /></button>
  );
}
