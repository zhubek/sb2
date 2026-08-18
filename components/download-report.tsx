"use client";

import { Download } from "lucide-react";
import {
  currentUser,
  hollandScales,
  mbtiScales,
  skills,
  tests,
} from "@/lib/mock-data";

// Кнопка «Скачать отчёт»: собирает результаты пройденных тестов в SVG-файл
export default function DownloadReport() {
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
      line("Тест «DeBruce» — топ-3 навыка", { bold: true });
      top3.forEach((n, i) => line(`${i + 1}. ${n}`));
      y += 14;
    }
    if (passed.has("mbti")) {
      line("Тест MBTI — тип личности", { bold: true });
      line(`${currentUser.mbtiType} · «${currentUser.mbtiTitle}»`);
      mbtiScales.forEach((s) => line(`${s.left} — ${s.right}: ${s.value}% · ${s.winner}`, { muted: true }));
      y += 14;
    }
    if (passed.has("holland")) {
      line("Тест Голланда — профиль интересов", { bold: true });
      line(`Код RIASEC: ${riasec}`);
      y += 14;
    } else {
      line("Тест Голланда ещё не пройден — пройдите его,", { muted: true });
      line("чтобы получить комплексную диагностику.", { muted: true });
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
      className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:text-violet-800"
    >
      <Download size={15} />
      Скачать отчёт
    </button>
  );
}
