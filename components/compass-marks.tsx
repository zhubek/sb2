// Фирменный знак-компас, предельно минималистичный: круг + наклонный ПОЛЫЙ ромб.
// Штрих ромба = штриху круга (3.5). Одна форма — разные анимации.
// Плюс семейство иконок в том же языке.

const INK = "#2a2e3b"; // stone-900
const VIOLET = "#4a47d1"; // violet-600
const CYAN = "#ff7a4d"; // cyan-400
const AMBER = "#ffc53d"; // amber-400
const MUTED = "#c3c8d6"; // stone-300
const SW = 3.5; // единая толщина штриха

// Узкий ромб (ширина 18) и стрелка: вершина фиксирована, боковые стороны
// «съезжают» вниз, нижняя вершина поднимается — ромб ⇄ стрелка.
const RHOMBUS = "32,14 41,32 32,50 23,32";
const ARROW = "32,14 41,46 32,34 23,46";

// 8-точечные версии для морфа в 4-лучевую звезду (число точек должно совпадать)
const RHOMBUS8 = "32,14 36.5,23 41,32 36.5,41 32,50 27.5,41 23,32 27.5,23";
const STAR8 = "32,12 37,27 52,32 37,37 32,52 27,37 12,32 27,27";

function Needle({
  className,
  morph = false,
}: {
  className?: string;
  morph?: boolean;
}) {
  const common = {
    fill: "none",
    stroke: VIOLET,
    strokeWidth: SW,
    strokeLinejoin: "round" as const,
  };
  if (morph) {
    return (
      <polygon points={RHOMBUS} {...common}>
        <animate
          attributeName="points"
          dur="3.6s"
          repeatCount="indefinite"
          values={`${RHOMBUS}; ${ARROW}; ${ARROW}; ${RHOMBUS}; ${RHOMBUS}`}
          keyTimes="0; 0.3; 0.5; 0.8; 1"
          calcMode="spline"
          keySplines="0.4 0 0.2 1; 0 0 1 1; 0.4 0 0.2 1; 0 0 1 1"
        />
      </polygon>
    );
  }
  return (
    <g className={className}>
      <polygon points={RHOMBUS} {...common} />
    </g>
  );
}

function CompassBase({
  className,
  needleClass,
  echo = false,
  morph = false,
}: {
  className?: string;
  needleClass?: string;
  echo?: boolean;
  morph?: boolean;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {echo && (
        <circle
          cx="32"
          cy="32"
          r="26"
          fill="none"
          stroke={MUTED}
          strokeWidth="3"
          className="c-pulse"
        />
      )}
      <circle cx="32" cy="32" r="26" fill="none" stroke={INK} strokeWidth={SW} />
      {/* Наклон 45° — ромб смотрит на северо-восток */}
      <g transform="rotate(45 32 32)">
        <Needle className={needleClass} morph={morph} />
      </g>
    </svg>
  );
}

export const compassMarks = [
  {
    id: "morph",
    name: "Морф",
    desc: "Ромб ⇄ стрелка: стороны съезжают и возвращаются",
    node: ({ className }: { className?: string }) => (
      <CompassBase className={className} morph />
    ),
  },
  {
    id: "wobble",
    name: "Покачивание",
    desc: "Ромб мягко качается",
    node: ({ className }: { className?: string }) => (
      <CompassBase className={className} needleClass="c-wobble" />
    ),
  },
  {
    id: "seek",
    name: "Поиск",
    desc: "Обходит круг и находит направление",
    node: ({ className }: { className?: string }) => (
      <CompassBase className={className} needleClass="c-seek" />
    ),
  },
  {
    id: "spin",
    name: "Вращение",
    desc: "Медленный непрерывный оборот",
    node: ({ className }: { className?: string }) => (
      <CompassBase className={className} needleClass="c-spin" />
    ),
  },
  {
    id: "tick",
    name: "Тик",
    desc: "Дискретные шаги по кругу",
    node: ({ className }: { className?: string }) => (
      <CompassBase className={className} needleClass="c-tick" />
    ),
  },
  {
    id: "echo",
    name: "Эхо",
    desc: "Ромб неподвижен, кольцо пульсирует",
    node: ({ className }: { className?: string }) => (
      <CompassBase className={className} echo />
    ),
  },
];

// ─── Логотип и семейство иконок в том же языке ──────────────────────────────

// Статичный знак для шапок: круг + наклонный полый ромб
export function LogoMark({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle
        cx="32"
        cy="32"
        r="26"
        fill="none"
        stroke={dark ? "#fff" : INK}
        strokeWidth={SW + 1}
      />
      <g transform="rotate(45 32 32)">
        <polygon
          points={RHOMBUS}
          fill="none"
          stroke={dark ? "#7480f5" : VIOLET}
          strokeWidth={SW + 1}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

// Уменьшенные версии ромба/звезды — звезда вписана в круг r=26
const RHOMBUS8_S =
  "32,17.5 35.5,24.75 39,32 35.5,39.25 32,46.5 28.5,39.25 25,32 28.5,24.75";
const STAR8_S = "32,12 36,28 52,32 36,36 32,52 28,36 12,32 28,28";

// AI: внутри круга ромб морфится в 4-лучевую звезду, вращение разгоняется
// и плавно тормозит, затем звезда возвращается в ромб — идеальный цикл.
// Градиент цвета вращается вокруг всё время.
export function IconAI({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="aiGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={VIOLET} />
          <stop offset="100%" stopColor={CYAN} />
          <animateTransform
            attributeName="gradientTransform"
            type="rotate"
            from="0 0.5 0.5"
            to="360 0.5 0.5"
            dur="3s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="26" fill="none" stroke={dark ? "#fff" : INK} strokeWidth={SW} />
      {/* Искры «генерации»: во время вращения мелкие полупрозрачные звёздочки
          появляются и гаснут в разных местах */}
      {(
        [
          [18, 20, CYAN, 0.16, 0.24, 0.32],
          [46, 17, VIOLET, 0.26, 0.34, 0.42],
          [47, 45, CYAN, 0.38, 0.47, 0.56],
          [17, 44, VIOLET, 0.5, 0.59, 0.68],
          [32, 11, CYAN, 0.62, 0.7, 0.78],
        ] as const
      ).map(([x, y, color, t1, t2, t3], i) => (
        <g key={i} transform={`translate(${x} ${y})`} opacity="0">
          <polygon points="0,-3.4 2.3,0 0,3.4 -2.3,0" fill={color} />
          <animate
            attributeName="opacity"
            dur="6s"
            repeatCount="indefinite"
            values="0; 0; 0.55; 0; 0"
            keyTimes={`0; ${t1}; ${t2}; ${t3}; 1`}
          />
        </g>
      ))}
      <g transform="rotate(45 32 32)"><g className="c-ai-spin">
          <polygon
            points={RHOMBUS8_S}
            fill="none"
            stroke="url(#aiGrad)"
            strokeWidth={SW}
            strokeLinejoin="round"
          >
            <animate
              attributeName="points"
              dur="6s"
              repeatCount="indefinite"
              values={`${RHOMBUS8_S}; ${STAR8_S}; ${STAR8_S}; ${RHOMBUS8_S}; ${RHOMBUS8_S}`}
              keyTimes="0; 0.12; 0.84; 0.92; 1"
              calcMode="spline"
              keySplines="0.45 0 0.55 1; 0 0 1 1; 0.45 0 0.55 1; 0 0 1 1"
            />
          </polygon>
        </g>
      </g>
    </svg>
  );
}

// Появление: ромб возникает из центра, вращаясь, и плавно останавливается
export function IconAppear({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="26" fill="none" stroke={INK} strokeWidth={SW} />
      <g transform="rotate(45 32 32)">
        <g className="c-appear">
          <polygon
            points={RHOMBUS}
            fill="none"
            stroke={VIOLET}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}

// Сертификат: крупная иллюстрация (не иконка). Документ статичен,
// в правом нижнем углу — маленький фирменный знак-печать, который дрожит.
export function CertificateArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 140" className={className} aria-hidden>
      {/* Лист */}
      <rect
        x="18"
        y="12"
        width="164"
        height="116"
        rx="7"
        fill="#fff"
        stroke={INK}
        strokeWidth={SW}
      />
      {/* Заголовок и строки */}
      <line
        x1="58"
        y1="40"
        x2="142"
        y2="40"
        stroke={INK}
        strokeWidth={SW + 0.5}
        strokeLinecap="round"
      />
      <line
        x1="42"
        y1="60"
        x2="158"
        y2="60"
        stroke={MUTED}
        strokeWidth={SW}
        strokeLinecap="round"
      />
      <line
        x1="42"
        y1="74"
        x2="146"
        y2="74"
        stroke={MUTED}
        strokeWidth={SW}
        strokeLinecap="round"
      />
      <line
        x1="42"
        y1="88"
        x2="120"
        y2="88"
        stroke={MUTED}
        strokeWidth={SW}
        strokeLinecap="round"
      />
      {/* Подпись */}
      <path
        d="M42 110 q8 -7 15 0 q6 6 13 -2"
        fill="none"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Печать — фирменный знак, дрожит */}
      <g className="c-shiver">
        <g transform="translate(148 96) scale(0.42)">
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="#fff"
            stroke={INK}
            strokeWidth={SW + 2}
          />
          <g transform="rotate(45 32 32)">
            <polygon
              points={RHOMBUS}
              fill="none"
              stroke={VIOLET}
              strokeWidth={SW + 2}
              strokeLinejoin="round"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

// Загрузка файла: лоток + полая стрелка уезжает вверх (для дропзоны портфолио)
export function IconUpload({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        d="M16 47 v7 h32 v-7"
        fill="none"
        stroke={INK}
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g className="c-up">
        <polygon
          points={ARROW}
          fill="none"
          stroke={VIOLET}
          strokeWidth={SW}
          strokeLinejoin="round"
          transform="translate(0 -4)"
        />
      </g>
    </svg>
  );
}

// AI-ассистент: знак-компас как голова робота — антенна и «взгляд» ромба
export function IconRobot({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <line x1="32" y1="17" x2="32" y2="10" stroke={dark ? "#fff" : INK}
        strokeWidth={SW}
        strokeLinecap="round"
      />
      <circle cx="32" cy="7.5" r="3" fill={AMBER} className="illu-pulse" />
      <circle cx="32" cy="38" r="21" fill="none" stroke={dark ? "#fff" : INK} strokeWidth={SW} />
      <g transform="rotate(45 32 38)">
        <g className="c-wobble">
          <polygon
            points="32,24 39,38 32,52 25,38"
            fill="none"
            stroke={dark ? "#7480f5" : VIOLET}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}

// Лоадер: ромб быстро вращается внутри круга (обработка, ожидание)
export function IconLoading({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="26" fill="none" stroke={INK} strokeWidth={SW} />
      <g className="c-spin-fast">
        <polygon
          points={RHOMBUS}
          fill="none"
          stroke={VIOLET}
          strokeWidth={SW}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

// Успех: ромб «вспыхивает» заливкой — шаг выполнен
export function IconDone({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="26" fill="none" stroke={dark ? "#fff" : INK} strokeWidth={SW} />
      <g transform="rotate(45 32 32)">
        <polygon
          points={RHOMBUS}
          stroke={VIOLET}
          strokeWidth={SW}
          strokeLinejoin="round"
          fill={VIOLET}
          fillOpacity="0"
        >
          <animate
            attributeName="fill-opacity"
            dur="2.4s"
            repeatCount="indefinite"
            values="0; 1; 1; 0"
            keyTimes="0; 0.25; 0.6; 1"
          />
        </polygon>
      </g>
    </svg>
  );
}

export const iconFamily = [
  { id: "ai", name: "AI-звезда", desc: "Ромб → звезда, разгон + вращение градиента", node: IconAI },
  { id: "appear", name: "Появление", desc: "Возникает из центра с вращением и замирает", node: IconAppear },
  { id: "upload", name: "Загрузка файла", desc: "Дропзона портфолио, импорт", node: IconUpload },
  { id: "robot", name: "AI-ассистент", desc: "Знак как голова робота: чат, подсказки", node: IconRobot },
  { id: "loading", name: "Лоадер", desc: "Обработка ответов, ожидание", node: IconLoading },
  { id: "done", name: "Успех", desc: "Шаг чек-листа выполнен", node: IconDone },
];
