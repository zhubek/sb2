// Крупные фирменные иллюстрации: чернильный штрих 4px, полый ромб,
// violet-акцент (teal-вариант для платформы педагога), одна живая деталь.
// Анимации — классы c-*/illu-* из globals.css.

export { CertificateArt } from "./compass-marks";

const INK = "#1c1917"; // stone-900
const VIOLET = "#7c3aed"; // violet-600
const VIOLET_SOFT = "#a78bfa"; // violet-400 (для тёмных поверхностей)
const TEAL = "#0d9488"; // teal-600
const CYAN = "#22d3ee";
const AMBER = "#fbbf24";
const MUTED = "#d6d3d1"; // stone-300
const SW = 4;

type Tone = "violet" | "teal";

function accent(dark: boolean, tone: Tone) {
  if (tone === "teal") return TEAL;
  return dark ? VIOLET_SOFT : VIOLET;
}
function ink(dark: boolean) {
  return dark ? "#fff" : INK;
}

const RHOMBUS_BIG = "0,-27 13.5,0 0,27 -13.5,0"; // узкий ромб вокруг (0,0)

function Spark({
  x,
  y,
  color,
  delay = 0,
  s = 4.5,
}: {
  x: number;
  y: number;
  color: string;
  delay?: number;
  s?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon
        points={`0,${-s} ${s * 0.68},0 0,${s} ${-s * 0.68},0`}
        fill={color}
        opacity="0.55"
        className="illu-pulse"
        style={{ animationDelay: `${delay}s` }}
      />
    </g>
  );
}

// ── Компас: герой, онбординг, заставка теста ────────────────────────────────
export function CompassArt({
  className,
  dark = false,
  tone = "violet" as Tone,
}: {
  className?: string;
  dark?: boolean;
  tone?: Tone;
}) {
  return (
    <svg viewBox="0 0 176 176" className={className} aria-hidden>
      {/* Вращающееся пунктирное кольцо-орбита */}
      <circle
        cx="88"
        cy="88"
        r="72"
        fill="none"
        stroke={dark ? "#475569" : MUTED}
        strokeWidth="3"
        strokeDasharray="5 12"
        strokeLinecap="round"
        className="c-spin"
      />
      <circle
        cx="88"
        cy="88"
        r="54"
        fill="none"
        stroke={ink(dark)}
        strokeWidth={SW}
      />
      {[0, 90, 180, 270].map((a) => (
        <line
          key={a}
          x1="88"
          y1="40"
          x2="88"
          y2="48"
          stroke={ink(dark)}
          strokeWidth={SW - 0.5}
          strokeLinecap="round"
          transform={`rotate(${a} 88 88)`}
        />
      ))}
      <g transform="rotate(45 88 88)">
        <g className="c-wobble">
          <g transform="translate(88 88)">
            <polygon
              points={RHOMBUS_BIG}
              fill="none"
              stroke={accent(dark, tone)}
              strokeWidth={SW}
              strokeLinejoin="round"
            />
          </g>
        </g>
      </g>
      <Spark x={26} y={44} color={CYAN} />
      <Spark x={152} y={38} color={accent(dark, tone)} delay={0.9} />
      <Spark x={148} y={140} color={CYAN} delay={1.7} />
    </svg>
  );
}

// ── Робот-ассистент: чат, онбординг ─────────────────────────────────────────
export function RobotArt({
  className,
  dark = false,
  tone = "violet" as Tone,
}: {
  className?: string;
  dark?: boolean;
  tone?: Tone;
}) {
  const a = accent(dark, tone);
  return (
    <svg viewBox="0 0 200 170" className={className} aria-hidden>
      {/* Антенна */}
      <line
        x1="88"
        y1="46"
        x2="88"
        y2="28"
        stroke={ink(dark)}
        strokeWidth={SW}
        strokeLinecap="round"
      />
      <circle cx="88" cy="22" r="6" fill={AMBER} className="illu-pulse" />
      {/* Уши */}
      <rect x="30" y="86" width="10" height="26" rx="5" fill="none" stroke={ink(dark)} strokeWidth={SW - 0.5} />
      <rect x="136" y="86" width="10" height="26" rx="5" fill="none" stroke={ink(dark)} strokeWidth={SW - 0.5} />
      {/* Голова — знак-компас */}
      <circle cx="88" cy="99" r="48" fill="none" stroke={ink(dark)} strokeWidth={SW} />
      <g transform="rotate(45 88 99)">
        <g className="c-wobble">
          <g transform="translate(88 99)">
            <polygon
              points={RHOMBUS_BIG}
              fill="none"
              stroke={a}
              strokeWidth={SW}
              strokeLinejoin="round"
            />
          </g>
        </g>
      </g>
      {/* Сообщение с мини-ромбом */}
      <g className="illu-float">
        <rect
          x="138"
          y="26"
          width="52"
          height="40"
          rx="12"
          fill={dark ? "#1e293b" : "#fff"}
          stroke={ink(dark)}
          strokeWidth={SW - 1}
        />
        <polygon
          points="150,64 146,76 162,66"
          fill={dark ? "#1e293b" : "#fff"}
          stroke={ink(dark)}
          strokeWidth={SW - 1.5}
        />
        <g transform="translate(164 46) rotate(45)">
          <polygon
            points="0,-9 4.5,0 0,9 -4.5,0"
            fill="none"
            stroke={a}
            strokeWidth={SW - 1}
            strokeLinejoin="round"
          />
        </g>
      </g>
      <Spark x={26} y={40} color={CYAN} delay={1.2} />
    </svg>
  );
}

// ── Отчёт: документ с навыками и AI-звездой ─────────────────────────────────
export function ReportArt({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const a = dark ? VIOLET_SOFT : VIOLET;
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <rect
        x="28"
        y="22"
        width="118"
        height="118"
        rx="8"
        fill={dark ? "transparent" : "#fff"}
        stroke={ink(dark)}
        strokeWidth={SW}
      />
      <line x1="46" y1="46" x2="112" y2="46" stroke={ink(dark)} strokeWidth={SW} strokeLinecap="round" />
      {/* Полосы навыков */}
      {(
        [
          [66, 82],
          [82, 64],
          [98, 72],
        ] as const
      ).map(([y, w], i) => (
        <g key={y}>
          <line
            x1="46"
            y1={y}
            x2="128"
            y2={y}
            stroke={dark ? "#475569" : MUTED}
            strokeWidth={SW}
            strokeLinecap="round"
          />
          <line
            x1="46"
            y1={y}
            x2={46 + w}
            y2={y}
            stroke={a}
            strokeWidth={SW}
            strokeLinecap="round"
            opacity={0.9 - i * 0.05}
          />
        </g>
      ))}
      <line x1="46" y1="118" x2="96" y2="118" stroke={dark ? "#475569" : MUTED} strokeWidth={SW - 1} strokeLinecap="round" />
      {/* AI-звезда над углом документа */}
      <g className="c-wobble">
        <g transform="translate(158 44)">
          <polygon
            points="0,-20 4.5,-4.5 20,0 4.5,4.5 0,20 -4.5,4.5 -20,0 -4.5,-4.5"
            fill="none"
            stroke={a}
            strokeWidth={SW - 1}
            strokeLinejoin="round"
          />
        </g>
      </g>
      <Spark x={166} y={78} color={CYAN} delay={0.7} />
      <Spark x={150} y={16} color={a} delay={1.5} s={3.6} />
    </svg>
  );
}

// ── Университет: здание с ромбом-флагом ─────────────────────────────────────
export function UniversityArt({
  className,
  dark = false,
  tone = "violet" as Tone,
}: {
  className?: string;
  dark?: boolean;
  tone?: Tone;
}) {
  const a = accent(dark, tone);
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      {/* Флаг-ромб */}
      <line x1="100" y1="42" x2="100" y2="16" stroke={ink(dark)} strokeWidth={SW - 0.5} strokeLinecap="round" />
      <g className="illu-float">
        <g transform="translate(100 22) rotate(90)">
          <polygon
            points="0,-10 5,0 0,10 -5,0"
            fill="none"
            stroke={a}
            strokeWidth={SW - 1}
            strokeLinejoin="round"
          />
        </g>
      </g>
      {/* Фронтон */}
      <polygon
        points="100,40 34,76 166,76"
        fill="none"
        stroke={ink(dark)}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      {/* Колонны */}
      {[52, 84, 116, 148].map((x) => (
        <line
          key={x}
          x1={x}
          y1="88"
          x2={x}
          y2="126"
          stroke={ink(dark)}
          strokeWidth={SW}
          strokeLinecap="round"
        />
      ))}
      {/* Ступени */}
      <line x1="40" y1="136" x2="160" y2="136" stroke={ink(dark)} strokeWidth={SW} strokeLinecap="round" />
      <line x1="30" y1="147" x2="170" y2="147" stroke={ink(dark)} strokeWidth={SW} strokeLinecap="round" />
      <Spark x={30} y={40} color={CYAN} />
      <Spark x={172} y={52} color={a} delay={1.1} />
    </svg>
  );
}

// ── Путь: маршрут через ромбы к выпускной шапочке ───────────────────────────
export function PathArt({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const a = dark ? VIOLET_SOFT : VIOLET;
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <path
        d="M20,138 C60,132 48,92 92,86 C136,80 138,54 168,40"
        fill="none"
        stroke={dark ? "#475569" : MUTED}
        strokeWidth={SW - 0.5}
        strokeDasharray="7 9"
        strokeLinecap="round"
        className="illu-dash"
      />
      {/* Вехи-ромбы */}
      {(
        [
          [20, 138],
          [92, 86],
        ] as const
      ).map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(45)`}>
          <polygon
            points="0,-9 4.5,0 0,9 -4.5,0"
            fill={i === 0 ? a : "none"}
            stroke={a}
            strokeWidth={SW - 1}
            strokeLinejoin="round"
          />
        </g>
      ))}
      {/* Выпускная шапочка */}
      <g className="illu-float">
        <polygon
          points="168,26 196,38 168,50 140,38"
          fill="none"
          stroke={ink(dark)}
          strokeWidth={SW - 0.5}
          strokeLinejoin="round"
        />
        <path
          d="M154,44 v10 c0,5 28,5 28,0 v-10"
          fill="none"
          stroke={ink(dark)}
          strokeWidth={SW - 0.5}
          strokeLinecap="round"
        />
        <line x1="192" y1="40" x2="192" y2="58" stroke={ink(dark)} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="192" cy="61" r="3" fill={AMBER} />
      </g>
      <Spark x={52} y={58} color={CYAN} delay={0.6} />
      <Spark x={150} y={118} color={a} delay={1.4} />
    </svg>
  );
}

// ── 404: компас растерянно ищет направление ─────────────────────────────────
export function LostArt({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <svg viewBox="0 0 176 176" className={className} aria-hidden>
      <circle cx="88" cy="88" r="54" fill="none" stroke={ink(dark)} strokeWidth={SW} />
      {[0, 90, 180, 270].map((a) => (
        <line
          key={a}
          x1="88"
          y1="40"
          x2="88"
          y2="48"
          stroke={ink(dark)}
          strokeWidth={SW - 0.5}
          strokeLinecap="round"
          transform={`rotate(${a} 88 88)`}
        />
      ))}
      <g className="c-seek">
        <g transform="translate(88 88)">
          <polygon
            points={RHOMBUS_BIG}
            fill="none"
            stroke={dark ? VIOLET_SOFT : VIOLET}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
        </g>
      </g>
      {/* Вопросительные искры */}
      <Spark x={148} y={36} color={AMBER} s={5.5} />
      <Spark x={28} y={132} color={CYAN} delay={1.2} />
    </svg>
  );
}

// ── Тесты: три интро-иллюстрации ────────────────────────────────────────────

// DeBruce: растущие полые столбцы, ромб парит над самым высоким
export function SkillsArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <line x1="36" y1="132" x2="164" y2="132" stroke={INK} strokeWidth={SW} strokeLinecap="round" />
      {(
        [
          [52, 96, 36],
          [90, 76, 56],
          [128, 52, 80],
        ] as const
      ).map(([x, y, h], i) => (
        <rect
          key={x}
          x={x}
          y={y}
          width="26"
          height={h}
          rx="6"
          fill={i === 2 ? "none" : "none"}
          stroke={i === 2 ? VIOLET : MUTED}
          strokeWidth={SW}
          className="illu-grow"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
      <g className="illu-float">
        <g transform="translate(141 32) rotate(45)">
          <polygon
            points="0,-10 5,0 0,10 -5,0"
            fill="none"
            stroke={VIOLET}
            strokeWidth={SW - 1}
            strokeLinejoin="round"
          />
        </g>
      </g>
      <Spark x={34} y={44} color={CYAN} />
      <Spark x={172} y={104} color={VIOLET} delay={1} />
    </svg>
  );
}

// MBTI: два ромба-половинки личности, встречаются
export function PersonalityArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <circle cx="100" cy="80" r="58" fill="none" stroke={MUTED} strokeWidth={SW - 1} strokeDasharray="4 10" strokeLinecap="round" className="c-spin" />
      <g className="c-wobble">
        <g transform="translate(78 80) rotate(45)">
          <polygon
            points="0,-24 12,0 0,24 -12,0"
            fill="none"
            stroke={VIOLET}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
        </g>
      </g>
      <g className="c-wobble" style={{ animationDelay: "1.8s" }}>
        <g transform="translate(124 80) rotate(45)">
          <polygon
            points="0,-24 12,0 0,24 -12,0"
            fill="none"
            stroke={INK}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
        </g>
      </g>
      <Spark x={36} y={38} color={CYAN} />
      <Spark x={166} y={124} color={VIOLET} delay={1.3} />
    </svg>
  );
}

// Голланд: роза интересов — ромб шагает по секторам
export function InterestsArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <circle cx="100" cy="80" r="56" fill="none" stroke={INK} strokeWidth={SW} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={a}
          x1="100"
          y1="30"
          x2="100"
          y2="38"
          stroke={a % 90 === 0 ? INK : MUTED}
          strokeWidth={SW - 1}
          strokeLinecap="round"
          transform={`rotate(${a} 100 80)`}
        />
      ))}
      <g className="c-tick">
        <g transform="translate(100 80)">
          <polygon
            points="0,-26 12,0 0,26 -12,0"
            fill="none"
            stroke={VIOLET}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
        </g>
      </g>
      <Spark x={34} y={124} color={CYAN} delay={0.5} />
      <Spark x={168} y={40} color={VIOLET} delay={1.6} />
    </svg>
  );
}
