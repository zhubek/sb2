"use client";

import {
  BarChart3,
  Cog,
  Code2,
  Gem,
  GraduationCap,
  Heart,
  HeartHandshake,
  Megaphone,
  Newspaper,
  Palette,
  Sparkles,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

// Герой лендинга: «отчёт генерируется» — сетчатая диаграмма интересов,
// графики сменяются 3D-переворотом (кнопки кликабельны), снизу 3D-лента
// карточек профессий с перетаскиванием.

const professions = [
  { name: "PR-менеджер", match: 92, Icon: Megaphone },
  { name: "Журналист", match: 88, Icon: Newspaper },
  { name: "UX-дизайнер", match: 85, Icon: Palette },
  { name: "Разработчик", match: 81, Icon: Code2 },
  { name: "Психолог", match: 78, Icon: HeartHandshake },
  { name: "Маркетолог", match: 76, Icon: TrendingUp },
  { name: "Учитель", match: 74, Icon: GraduationCap },
  { name: "Врач", match: 71, Icon: Stethoscope },
  { name: "Инженер", match: 69, Icon: Cog },
  { name: "Аналитик данных", match: 67, Icon: BarChart3 },
];

const charts = [
  { key: "interests", label: "Интересы", Icon: Heart },
  { key: "skills", label: "Навыки", Icon: BarChart3 },
  { key: "values", label: "Ценности", Icon: Gem },
];

const skills = [
  { name: "Креативность", v: 92 },
  { name: "Коммуникация", v: 88 },
  { name: "Эмпатия", v: 85 },
];

const values = [64, 88, 52, 95, 74];

// RIASEC-профиль для сетчатой диаграммы (0..1)
const radar = [
  { label: "R", v: 0.35 },
  { label: "I", v: 0.55 },
  { label: "A", v: 0.9 },
  { label: "S", v: 0.82 },
  { label: "E", v: 0.68 },
  { label: "C", v: 0.3 },
];

const SLOT = 54; // шаг ленты карточек, px
const TICK_MS = 1700;
const CHART_MS = 3600;

function radarPoint(i: number, r: number, cx = 50, cy = 40, R = 34) {
  const a = (Math.PI * 2 * i) / radar.length - Math.PI / 2;
  return [cx + Math.cos(a) * R * r, cy + Math.sin(a) * R * r] as const;
}
function radarPath(scale: number) {
  return radar
    .map((d, i) => {
      const [x, y] = radarPoint(i, d.v * scale);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ")
    .concat(" Z");
}

export default function ProfessionCarousel() {
  const [idx, setIdx] = useState(0);
  const [chartIdx, setChartIdx] = useState(0);
  const [drag, setDrag] = useState<{ startY: number; offset: number } | null>(
    null
  );

  const n = professions.length;

  // Автопрокрутка карточек (пауза во время перетаскивания)
  useEffect(() => {
    if (drag) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % n), TICK_MS);
    return () => clearTimeout(t);
  }, [idx, drag, n]);

  // Автосмена графиков; клик по кнопке перезапускает таймер
  useEffect(() => {
    const t = setTimeout(
      () => setChartIdx((i) => (i + 1) % charts.length),
      CHART_MS
    );
    return () => clearTimeout(t);
  }, [chartIdx]);

  function endDrag() {
    if (!drag) return;
    const steps = Math.round(-drag.offset / SLOT);
    setIdx((i) => (((i + steps) % n) + n) % n);
    setDrag(null);
  }

  const dragOffset = drag?.offset ?? 0;

  return (
    <div className="w-full max-w-md">
      <div
        className="rounded-2xl border border-slate-600/50 bg-slate-900/85 p-5 shadow-[20px_20px_60px_rgba(0,0,0,0.5),_0_0_0_1px_rgba(255,255,255,0.08)_inset] backdrop-blur-xl"
        style={{ transform: "perspective(1200px) rotateY(-7deg) rotateX(3deg)" }}
      >
        {/* Шапка «браузера» */}
        <div className="mb-4 flex items-center gap-2 border-b border-slate-700/50 pb-3.5">
          <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <div className="ml-3 flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-slate-500 uppercase">
            <Sparkles size={10} className="text-cyan-400" />
            комплексный отчёт
          </div>
        </div>

        {/* Переключатель типов графиков — кликабельный */}
        <div className="flex gap-1.5">
          {charts.map((c, i) => {
            const active = i === chartIdx;
            const { Icon } = c;
            return (
              <button
                key={c.key}
                onClick={() => setChartIdx(i)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] transition-all duration-500 ${
                  active
                    ? "bg-violet-500/20 font-medium text-violet-300"
                    : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                }`}
              >
                <Icon size={11} />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Сцена графиков: 3D-переворот между типами */}
        <div className="relative mt-2 h-32" style={{ perspective: "800px" }}>
          {/* Интересы: сетчатая диаграмма (RIASEC) */}
          <ChartPane active={chartIdx === 0}>
            <svg viewBox="0 0 100 80" className="mx-auto h-full">
              {/* Сетка */}
              {[1, 0.66, 0.33].map((s) => (
                <path
                  key={s}
                  d={radar
                    .map((_, i) => {
                      const [x, y] = radarPoint(i, s);
                      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
                    })
                    .join(" ")
                    .concat(" Z")}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="0.7"
                />
              ))}
              {/* Оси */}
              {radar.map((_, i) => {
                const [x, y] = radarPoint(i, 1);
                return (
                  <line
                    key={i}
                    x1="50"
                    y1="40"
                    x2={x}
                    y2={y}
                    stroke="#334155"
                    strokeWidth="0.7"
                  />
                );
              })}
              {/* Данные — вырастают из центра в цикле */}
              <g className="lp-radar">
                <path
                  d={radarPath(1)}
                  fill="rgba(139,92,246,0.28)"
                  stroke="#a78bfa"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                {radar.map((d, i) => {
                  const [x, y] = radarPoint(i, d.v);
                  return <circle key={i} cx={x} cy={y} r="1.7" fill="#22d3ee" />;
                })}
              </g>
              {/* Подписи осей */}
              {radar.map((d, i) => {
                const [x, y] = radarPoint(i, 1.22);
                return (
                  <text
                    key={d.label}
                    x={x}
                    y={y + 2}
                    textAnchor="middle"
                    fontSize="6"
                    fontFamily="monospace"
                    fill="#64748b"
                  >
                    {d.label}
                  </text>
                );
              })}
            </svg>
          </ChartPane>

          {/* Навыки: горизонтальные полосы */}
          <ChartPane active={chartIdx === 1}>
            <div className="flex h-full flex-col justify-center space-y-2.5">
              {skills.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2.5">
                  <span className="w-24 truncate text-xs text-slate-400">
                    {s.name}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full origin-left rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                      style={{
                        width: `${s.v}%`,
                        animation: `lp-bar-grow ${CHART_MS}ms ease-in-out ${i * 0.25}s infinite`,
                      }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-[10px] text-slate-500">
                    {s.v}
                  </span>
                </div>
              ))}
            </div>
          </ChartPane>

          {/* Ценности: колонки */}
          <ChartPane active={chartIdx === 2}>
            <div className="flex h-full items-end justify-around gap-2 px-3 pb-1">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="w-7 origin-bottom rounded-t-md bg-gradient-to-t from-violet-600 to-cyan-400"
                  style={{
                    height: `${v}%`,
                    animation: `lp-col-grow ${CHART_MS}ms ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </div>
          </ChartPane>
        </div>

        {/* Лента карточек профессий: 3D-барабан с перетаскиванием */}
        <div className="mt-4 border-t border-slate-700/50 pt-3">
          <p className="text-[10px] tracking-wider text-slate-500 uppercase">
            Подходящие профессии
          </p>
          <div
            className={`relative mt-1.5 h-[168px] touch-none select-none ${
              drag ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              perspective: "700px",
              maskImage:
                "linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)",
            }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setDrag({ startY: e.clientY, offset: 0 });
            }}
            onPointerMove={(e) => {
              if (drag) setDrag({ ...drag, offset: e.clientY - drag.startY });
            }}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {professions.map((p, i) => {
              let delta = (i - idx + n) % n;
              if (delta > n / 2) delta -= n;
              if (Math.abs(delta) > 3) return null;

              // Дробное смещение с учётом перетаскивания
              const t = delta + dragOffset / SLOT;
              const active = Math.abs(t) < 0.5;
              const { Icon } = p;
              return (
                <div
                  key={p.name}
                  className={`absolute inset-x-1 flex items-center gap-2.5 rounded-lg border px-3 py-2 ease-in-out ${
                    drag ? "duration-0" : "transition-all duration-700"
                  } ${
                    active
                      ? "border-violet-500/50 bg-slate-800/95 shadow-[0_0_25px_rgba(124,58,237,0.2)]"
                      : "border-slate-700/50 bg-slate-800/50"
                  }`}
                  style={{
                    top: "50%",
                    transform: `translateY(calc(-50% + ${t * SLOT}px)) rotateX(${t * -32}deg) translateZ(${active ? 18 : 0}px)`,
                    opacity: Math.max(0.08, 1 - Math.abs(t) * 0.5),
                  }}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
                      active
                        ? "bg-violet-500/20 text-violet-300"
                        : "bg-slate-700/60 text-slate-500"
                    }`}
                  >
                    <Icon size={14} />
                  </span>
                  <span
                    className={`flex-1 truncate text-sm transition-colors ${
                      active ? "font-medium text-white" : "text-slate-400"
                    }`}
                  >
                    {p.name}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[11px] transition-colors ${
                      active
                        ? "bg-violet-500/20 text-violet-300"
                        : "text-slate-600"
                    }`}
                  >
                    {p.match}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Панель графика с 3D-переворотом при смене типа
function ChartPane({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 rounded-xl border border-slate-700/60 bg-slate-800/40 p-3 transition-all duration-700 ease-in-out"
      style={{
        transform: active ? "rotateX(0deg)" : "rotateX(-82deg)",
        transformOrigin: "center 60%",
        opacity: active ? 1 : 0,
        pointerEvents: active ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
}
