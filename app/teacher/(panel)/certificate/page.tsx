"use client";

import { Award, Check, Download, QrCode, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import {
  downloadCertificate,
  generateCertificateSvg,
} from "@/lib/certificate";
import { completeChecklistStep } from "@/lib/checklist-events";
import {
  gamificationSteps,
  teacher,
  teacherBadges,
} from "@/lib/teacher-mock-data";

const STORAGE_KEY = "teacher-gamification-done";
const CERT_ID = "PRF-2026-GA-0417";

export default function CertificatePage() {
  const [done, setDone] = useState<string[]>(() =>
    gamificationSteps.filter((s) => s.initiallyDone).map((s) => s.id)
  );
  const [downloading, setDownloading] = useState(false);

  // Прогресс сохраняется между визитами
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setDone(JSON.parse(saved));
  }, []);

  function complete(id: string) {
    const next = [...new Set([...done, id])];
    setDone(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    completeChecklistStep(id); // виджет в меню откроется сам + конфетти
  }

  const points = gamificationSteps
    .filter((s) => done.includes(s.id))
    .reduce((n, s) => n + s.points, 0);
  const totalPoints = gamificationSteps.reduce((n, s) => n + s.points, 0);
  const allDone = gamificationSteps.every((s) => done.includes(s.id));

  async function handleDownload() {
    setDownloading(true);
    const verifyUrl = `${window.location.origin}/verify/${CERT_ID}`;
    const svg = await generateCertificateSvg({
      name: `${teacher.firstName} ${teacher.lastName}`,
      school: teacher.school,
      certId: CERT_ID,
      date: "28 июля 2026",
      verifyUrl,
    });
    downloadCertificate(svg, `certificate-${CERT_ID}.svg`);
    setDownloading(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Сертификат
        </h1>
        <p className="mt-1 text-slate-500">
          Пройдите все шаги программы — и получите именной сертификат
        </p>
      </div>

      {/* Баллы и шаги */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs tracking-wider text-slate-400 uppercase">
            Баллы
          </p>
          <p className="font-display mt-1 text-xl font-semibold">
            {points}{" "}
            <span className="text-sm font-normal text-slate-400">
              / {totalPoints}
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs tracking-wider text-slate-400 uppercase">
            Шагов пройдено
          </p>
          <p className="font-display mt-1 text-xl font-semibold">
            {done.length}{" "}
            <span className="text-sm font-normal text-slate-400">
              / {gamificationSteps.length}
            </span>
          </p>
        </div>
      </div>

      {/* Баннер о сертификате / кнопка скачивания */}
      {allDone ? (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-teal-200 bg-teal-50 p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-white">
              <Trophy size={22} />
            </span>
            <div>
              <p className="font-display font-medium text-teal-900">
                Все шаги пройдены — сертификат ваш!
              </p>
              <p className="mt-0.5 text-sm text-teal-800/70">
                Именной сертификат с QR-кодом и ссылкой для проверки
                подлинности · ID {CERT_ID}
              </p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-60"
          >
            <Download size={16} />
            {downloading ? "Готовим…" : "Скачать сертификат"}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <QrCode size={22} className="shrink-0 text-amber-700" />
          <p className="text-sm leading-relaxed text-amber-900">
            <span className="font-medium">
              Пройдите все {gamificationSteps.length} шагов
            </span>{" "}
            — и получите именной сертификат профориентатора с QR-кодом и
            ссылкой для проверки подлинности. Осталось шагов:{" "}
            {gamificationSteps.length - done.length}.
          </p>
        </div>
      )}

      {/* Шаги программы */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Шаги программы подготовки</h2>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-700"
            style={{ width: `${(done.length / gamificationSteps.length) * 100}%` }}
          />
        </div>
        <ul className="mt-5 divide-y divide-slate-100">
          {gamificationSteps.map((s, i) => {
            const isDone = done.includes(s.id);
            return (
              <li key={s.id} className="flex items-center gap-4 py-4">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs transition ${
                    isDone
                      ? "bg-teal-600 text-white"
                      : "border border-slate-300 text-slate-400"
                  }`}
                >
                  {isDone ? <Check size={15} /> : String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      isDone ? "text-slate-400 line-through" : ""
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{s.desc}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-slate-400">
                  +{s.points}
                </span>
                {!isDone && (
                  <button
                    onClick={() => complete(s.id)}
                    className="shrink-0 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-teal-700"
                  >
                    {s.action}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Значки */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Значки</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {teacherBadges.map((b) => (
            <div
              key={b.id}
              className={`rounded-xl border p-4 text-center ${
                b.earned
                  ? "border-teal-200 bg-teal-50/50"
                  : "border-slate-100 opacity-45"
              }`}
            >
              <Award
                size={26}
                className={`mx-auto ${b.earned ? "text-teal-600" : "text-slate-300"}`}
              />
              <p className="mt-2 text-xs font-medium">{b.name}</p>
              <p className="mt-1 text-[11px] leading-snug text-slate-400">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
