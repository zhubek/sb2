// Фирменные плоские SVG-иллюстрации студенческой платформы (индиго-палитра).
// Анимации — CSS-классы illu-* из globals.css; уважают prefers-reduced-motion.

const C = {
  blob: "#eef2ff", // indigo-50
  light: "#a5b4fc", // indigo-300
  mid: "#6366f1", // indigo-500
  primary: "#4f46e5", // indigo-600
  dark: "#312e81", // indigo-900
  accent: "#fbbf24", // amber-400
  white: "#ffffff",
};

function Sparkle({
  x,
  y,
  s = 6,
  delay = 0,
}: {
  x: number;
  y: number;
  s?: number;
  delay?: number;
}) {
  return (
    <path
      d={`M${x},${y - s} L${x + s / 3},${y - s / 3} L${x + s},${y} L${x + s / 3},${y + s / 3} L${x},${y + s} L${x - s / 3},${y + s / 3} L${x - s},${y} L${x - s / 3},${y - s / 3} Z`}
      fill={C.light}
      className="illu-pulse"
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

// Путь: от старта к выпускной шапочке (герой лендинга)
export function IlluJourney({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 240" className={className} aria-hidden>
      <ellipse cx="160" cy="130" rx="150" ry="92" fill={C.blob} />
      <path
        d="M44,200 C104,184 78,126 150,112 C216,99 240,84 268,54"
        fill="none"
        stroke={C.light}
        strokeWidth="3.5"
        strokeDasharray="7 8"
        strokeLinecap="round"
        className="illu-dash"
      />
      <circle cx="44" cy="200" r="7" fill={C.primary} />
      <circle cx="150" cy="112" r="6" fill={C.white} stroke={C.primary} strokeWidth="3" />
      <circle cx="222" cy="88" r="6" fill={C.white} stroke={C.primary} strokeWidth="3" />
      {/* Выпускная шапочка */}
      <g className="illu-float">
        <polygon points="268,26 302,42 268,58 234,42" fill={C.dark} />
        <path d="M252,50 v14 c0,7 32,7 32,0 v-14" fill={C.primary} />
        <line x1="298" y1="44" x2="298" y2="66" stroke={C.dark} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="298" cy="69" r="3.5" fill={C.accent} />
      </g>
      <Sparkle x={92} y={62} s={7} />
      <Sparkle x={228} y={166} s={6} delay={0.8} />
      <Sparkle x={288} y={110} s={5} delay={1.6} />
    </svg>
  );
}

// Рейтинг навыков: растущие столбцы со звездой (DeBruce)
export function IlluSkills({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <ellipse cx="100" cy="90" rx="86" ry="60" fill={C.blob} />
      <line x1="42" y1="130" x2="158" y2="130" stroke={C.light} strokeWidth="3" strokeLinecap="round" />
      <rect x="55" y="96" width="20" height="34" rx="5" fill={C.light} className="illu-grow" />
      <rect
        x="90"
        y="76"
        width="20"
        height="54"
        rx="5"
        fill={C.mid}
        className="illu-grow"
        style={{ animationDelay: "0.15s" }}
      />
      <rect
        x="125"
        y="56"
        width="20"
        height="74"
        rx="5"
        fill={C.primary}
        className="illu-grow"
        style={{ animationDelay: "0.3s" }}
      />
      <g className="illu-float">
        <path
          d="M135,30 l4.2,8.5 9.4,1.4 -6.8,6.6 1.6,9.3 -8.4,-4.4 -8.4,4.4 1.6,-9.3 -6.8,-6.6 9.4,-1.4 Z"
          fill={C.accent}
        />
      </g>
      <Sparkle x={52} y={58} s={6} />
      <Sparkle x={162} y={100} s={5} delay={1.2} />
    </svg>
  );
}

// ИИ-ассистент: робот с сообщением
export function IlluRobot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <ellipse cx="100" cy="92" rx="86" ry="58" fill={C.blob} />
      {/* Антенна */}
      <line x1="96" y1="62" x2="96" y2="46" stroke={C.dark} strokeWidth="3" strokeLinecap="round" />
      <circle cx="96" cy="41" r="5" fill={C.accent} className="illu-pulse" />
      {/* Уши */}
      <rect x="48" y="84" width="9" height="22" rx="4" fill={C.light} />
      <rect x="135" y="84" width="9" height="22" rx="4" fill={C.light} />
      {/* Голова */}
      <rect x="56" y="62" width="80" height="66" rx="18" fill={C.primary} />
      <rect x="68" y="78" width="56" height="36" rx="11" fill={C.blob} />
      <circle cx="86" cy="94" r="5.5" fill={C.primary} className="illu-blink" />
      <circle
        cx="108"
        cy="94"
        r="5.5"
        fill={C.primary}
        className="illu-blink"
        style={{ animationDelay: "0.05s" }}
      />
      <path d="M90,105 q7,5 14,0" fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinecap="round" />
      {/* Сообщение */}
      <g className="illu-float">
        <rect x="128" y="26" width="52" height="30" rx="11" fill={C.white} stroke={C.light} strokeWidth="2.5" />
        <polygon points="140,54 134,66 152,56" fill={C.white} stroke={C.light} strokeWidth="2" />
        <circle cx="144" cy="41" r="3.2" fill={C.primary} />
        <circle cx="154" cy="41" r="3.2" fill={C.mid} />
        <circle cx="164" cy="41" r="3.2" fill={C.light} />
      </g>
      <Sparkle x={40} y={54} s={6} />
    </svg>
  );
}

// Университет: здание с флагом
export function IlluUniversity({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <ellipse cx="100" cy="94" rx="86" ry="58" fill={C.blob} />
      {/* Флаг */}
      <g className="illu-float">
        <line x1="100" y1="36" x2="100" y2="14" stroke={C.dark} strokeWidth="3" strokeLinecap="round" />
        <polygon points="100,14 124,20 100,27" fill={C.accent} />
      </g>
      {/* Фронтон и колонны */}
      <polygon points="100,34 40,72 160,72" fill={C.primary} />
      <rect x="48" y="72" width="104" height="9" rx="3" fill={C.mid} />
      <rect x="58" y="87" width="13" height="42" rx="4" fill={C.light} />
      <rect x="93" y="87" width="13" height="42" rx="4" fill={C.light} />
      <rect x="128" y="87" width="13" height="42" rx="4" fill={C.light} />
      <rect x="44" y="130" width="112" height="8" rx="3" fill={C.mid} />
      <rect x="37" y="138" width="126" height="8" rx="3" fill={C.primary} />
      <Sparkle x={36} y={48} s={6} />
      <Sparkle x={168} y={56} s={5} delay={1} />
    </svg>
  );
}

// Портфолио: папка с медалью
export function IlluFolder({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <ellipse cx="100" cy="92" rx="86" ry="58" fill={C.blob} />
      <rect x="48" y="48" width="42" height="18" rx="7" fill={C.light} />
      <rect x="48" y="56" width="104" height="64" rx="10" fill={C.light} />
      <rect x="58" y="50" width="80" height="12" rx="4" fill={C.white} />
      <rect x="42" y="68" width="116" height="56" rx="10" fill={C.primary} />
      {/* Медаль */}
      <g className="illu-float">
        <polygon points="138,126 148,150 158,126" fill={C.mid} />
        <circle cx="148" cy="118" r="19" fill={C.accent} stroke={C.white} strokeWidth="3.5" />
        <path
          d="M148,108 l3,6.2 6.9,1 -5,4.8 1.2,6.8 -6.1,-3.2 -6.1,3.2 1.2,-6.8 -5,-4.8 6.9,-1 Z"
          fill={C.white}
        />
      </g>
      <Sparkle x={44} y={42} s={6} />
    </svg>
  );
}

// Компас: профессиональные интересы (Голланд)
export function IlluCompass({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <ellipse cx="100" cy="88" rx="86" ry="60" fill={C.blob} />
      <circle cx="100" cy="88" r="46" fill={C.white} stroke={C.primary} strokeWidth="4.5" />
      <line x1="100" y1="48" x2="100" y2="56" stroke={C.light} strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="120" x2="100" y2="128" stroke={C.light} strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="88" x2="68" y2="88" stroke={C.light} strokeWidth="3" strokeLinecap="round" />
      <line x1="132" y1="88" x2="140" y2="88" stroke={C.light} strokeWidth="3" strokeLinecap="round" />
      <g className="illu-wobble" style={{ transformOrigin: "100px 88px" }}>
        <polygon points="100,88 124,60 96,82" fill={C.primary} />
        <polygon points="100,88 76,116 104,94" fill={C.light} />
      </g>
      <circle cx="100" cy="88" r="6" fill={C.dark} />
      <Sparkle x={162} y={44} s={6} />
      <Sparkle x={38} y={124} s={5} delay={1.4} />
    </svg>
  );
}

// Пазл: тип личности (MBTI)
export function IlluPuzzle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <ellipse cx="100" cy="88" rx="86" ry="60" fill={C.blob} />
      <g className="illu-float">
        <rect x="46" y="60" width="54" height="54" rx="9" fill={C.primary} />
        <circle cx="100" cy="87" r="11" fill={C.primary} />
        <circle cx="66" cy="80" r="4" fill={C.white} opacity="0.6" />
      </g>
      <g className="illu-float" style={{ animationDelay: "1.6s" }}>
        <rect x="108" y="60" width="54" height="54" rx="9" fill={C.light} />
        <circle cx="108" cy="87" r="11" fill={C.blob} />
        <circle cx="140" cy="98" r="4" fill={C.white} opacity="0.8" />
      </g>
      <Sparkle x={40} y={44} s={6} />
      <Sparkle x={164} y={126} s={5} delay={0.9} />
    </svg>
  );
}

// Ракета: быстрый старт
export function IlluRocket({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <ellipse cx="100" cy="88" rx="86" ry="60" fill={C.blob} />
      <g className="illu-float">
        {/* Стабилизаторы */}
        <polygon points="86,98 62,126 86,118" fill={C.mid} />
        <polygon points="114,98 138,126 114,118" fill={C.mid} />
        {/* Корпус */}
        <path
          d="M100,26 C116,42 121,78 112,110 L88,110 C79,78 84,42 100,26 Z"
          fill={C.white}
          stroke={C.primary}
          strokeWidth="3.5"
        />
        <path d="M100,26 C107,33 111,42 113,52 L87,52 C89,42 93,33 100,26 Z" fill={C.primary} />
        <circle cx="100" cy="72" r="10" fill={C.light} stroke={C.primary} strokeWidth="3" />
        {/* Пламя */}
        <polygon points="93,112 100,136 107,112" fill={C.accent} className="illu-flame" />
      </g>
      <line x1="72" y1="140" x2="82" y2="130" stroke={C.light} strokeWidth="3" strokeLinecap="round" className="illu-pulse" />
      <line
        x1="128"
        y1="140"
        x2="118"
        y2="130"
        stroke={C.light}
        strokeWidth="3"
        strokeLinecap="round"
        className="illu-pulse"
        style={{ animationDelay: "0.7s" }}
      />
      <Sparkle x={44} y={60} s={6} />
      <Sparkle x={158} y={52} s={6} delay={1.1} />
    </svg>
  );
}
