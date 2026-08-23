// Фирменные анимированные иллюстрации для секции «Что происходит с результатами».
// Палитра ядра: индиго #5A5FE8, коралл #FF7A4D, мята #22C07A, янтарь #FFC53D.
// Анимации — классы .illu-* из globals.css (отключаются при reduced-motion).

const INDIGO = "#5A5FE8";
const CORAL = "#FF7A4D";
const MINT = "#22C07A";
const AMBER = "#FFC53D";
const INK = "#20242f";

type P = { className?: string };

// «Это не экзамен»: лист с оценкой перечёркнут, вместо него — галочка
export function NoExamArt({ className }: P) {
  return (
    <svg viewBox="0 0 160 110" className={className} aria-hidden="true">
      <g className="illu-float">
        <rect x="34" y="14" width="70" height="86" rx="10" fill="#fff" stroke={INK} strokeWidth="3" />
        <rect x="48" y="30" width="42" height="5" rx="2.5" fill="#dde0ea" />
        <rect x="48" y="42" width="30" height="5" rx="2.5" fill="#dde0ea" />
        <rect x="48" y="54" width="36" height="5" rx="2.5" fill="#dde0ea" />
        {/* Оценка «2», перечёркнутая */}
        <text x="56" y="88" fontSize="26" fontWeight="800" fill={CORAL} fontFamily="inherit">
          2
        </text>
        <line x1="50" y1="90" x2="76" y2="66" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      </g>
      {/* Бейдж-галочка */}
      <g className="illu-pulse" style={{ animationDuration: "2.8s" }}>
        <circle cx="112" cy="76" r="22" fill={MINT} />
        <path d="M101 76l8 8 15-16" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle cx="26" cy="28" r="4" fill={AMBER} className="illu-pulse" />
      <circle cx="134" cy="26" r="3" fill={INDIGO} className="illu-pulse" style={{ animationDelay: "0.8s" }} />
    </svg>
  );
}

// «Твой профориентатор видит твой отчёт»: педагог читает отчёт —
// строки появляются одна за другой, затем педагог «отвечает» пузырём-галочкой
export function TeacherSeesArt({ className }: P) {
  return (
    <svg viewBox="0 0 160 110" className={className} aria-hidden="true">
      {/* Педагог */}
      <circle cx="42" cy="44" r="16" fill={AMBER} />
      {/* Причёска — шапочка по верху головы */}
      <path d="M26 44a16 16 0 0 1 32 0c-4-4-8-6-16-6s-12 2-16 6z" fill={INK} />
      {/* Лицо: глаза и улыбка */}
      <circle cx="36.5" cy="47" r="1.8" fill={INK} />
      <circle cx="47.5" cy="47" r="1.8" fill={INK} />
      <path d="M37 53c2.5 2.5 7.5 2.5 10 0" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      {/* Шея и плечи — вплотную к голове */}
      <rect x="37" y="56" width="10" height="10" rx="3" fill={AMBER} />
      <path d="M18 100c0-20 11-36 24-36s24 16 24 36" fill={INDIGO} />
      <rect x="34" y="68" width="16" height="8" rx="4" fill="#fff" opacity="0.9" />
      {/* Пузырь-реакция педагога */}
      <g className="illu-pop">
        <path d="M54 22a9 9 0 0 1 9-9h20a9 9 0 0 1 9 9v10a9 9 0 0 1-9 9H66l-8 7v-7h-4a9 9 0 0 1-9-9z" fill={MINT} />
        <path d="M66 27l5 5 9-10" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* Отчёт — строки «печатаются» по очереди */}
      <rect x="92" y="14" width="58" height="82" rx="9" fill="#fff" stroke={INK} strokeWidth="3" />
      <rect x="102" y="26" width="24" height="6" rx="3" fill={INDIGO} className="illu-type" />
      <rect x="102" y="40" width="38" height="4" rx="2" fill="#c3c8d6" className="illu-type" style={{ animationDelay: "0.35s" }} />
      <rect x="102" y="50" width="30" height="4" rx="2" fill="#c3c8d6" className="illu-type" style={{ animationDelay: "0.7s" }} />
      <rect x="102" y="60" width="36" height="4" rx="2" fill="#c3c8d6" className="illu-type" style={{ animationDelay: "1.05s" }} />
      <rect x="102" y="72" width="38" height="8" rx="4" fill="#eceef4" />
      <rect x="102" y="72" width="28" height="8" rx="4" fill={CORAL} className="illu-type" style={{ animationDelay: "1.4s" }} />
      <rect x="102" y="84" width="20" height="4" rx="2" fill={MINT} className="illu-type" style={{ animationDelay: "1.75s" }} />
    </svg>
  );
}

// «Одноклассники ничего не видят»: замок + зачёркнутый глаз, глаз моргает
export function NobodySeesArt({ className }: P) {
  return (
    <svg viewBox="0 0 160 110" className={className} aria-hidden="true">
      {/* Замок */}
      <g className="illu-float">
        <path d="M56 48v-12a24 24 0 0 1 48 0v12" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <rect x="44" y="46" width="72" height="52" rx="12" fill={INDIGO} />
        <circle cx="80" cy="68" r="7" fill="#fff" />
        <rect x="77" y="70" width="6" height="14" rx="3" fill="#fff" />
      </g>
      {/* Глаз с чертой */}
      <g className="illu-blink">
        <path d="M8 40c10-12 24-12 34 0-10 12-24 12-34 0z" fill="#fff" stroke={INK} strokeWidth="3" />
        <circle cx="25" cy="40" r="5" fill={INK} />
      </g>
      <line x1="10" y1="52" x2="40" y2="28" stroke={CORAL} strokeWidth="4" strokeLinecap="round" />
      <circle cx="138" cy="30" r="5" fill={MINT} className="illu-pulse" />
      <circle cx="146" cy="88" r="3.5" fill={AMBER} className="illu-pulse" style={{ animationDelay: "1s" }} />
    </svg>
  );
}

// «Проходи сколько угодно раз»: в календаре по очереди загораются разные дни,
// а значок повтора делает оборот и замирает — как кнопка «обновить»
export function RetakeArt({ className }: P) {
  const days = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <svg viewBox="0 0 160 110" className={className} aria-hidden="true">
      <rect x="22" y="24" width="84" height="72" rx="10" fill="#fff" stroke={INK} strokeWidth="3" />
      <rect x="22" y="24" width="84" height="18" rx="10" fill={CORAL} />
      <rect x="22" y="34" width="84" height="8" fill={CORAL} />
      <rect x="40" y="16" width="6" height="14" rx="3" fill={INK} />
      <rect x="82" y="16" width="6" height="14" rx="3" fill={INK} />
      {days.map((i) => {
        const x = 34 + (i % 4) * 16;
        const y = 52 + Math.floor(i / 4) * 16;
        return (
          <g key={i}>
            <rect x={x} y={y} width="11" height="11" rx="3" fill="#dde0ea" />
            {/* Подсветка дня — загораются по очереди */}
            <rect
              x={x}
              y={y}
              width="11"
              height="11"
              rx="3"
              fill={i % 3 === 1 ? MINT : INDIGO}
              className="illu-day"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          </g>
        );
      })}
      {/* Значок повтора: кольцо из двух стрелок, оборот + пауза */}
      <circle cx="126" cy="74" r="22" fill={MINT} />
      <g className="illu-refresh">
        <path d="M114 74a12 12 0 0 1 20-9" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <path d="M138 74a12 12 0 0 1-20 9" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <path d="M131 62l4 4-5 3" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M121 86l-4-4 5-3" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

// «Отчёт — повод поговорить с родителями»: два пузыря диалога и отчёт между ними
export function TalkArt({ className }: P) {
  return (
    <svg viewBox="0 0 220 110" className={className} aria-hidden="true">
      {/* Левый пузырь (ученик) */}
      <g className="illu-float">
        <path d="M14 30a12 12 0 0 1 12-12h50a12 12 0 0 1 12 12v22a12 12 0 0 1-12 12H40l-14 12V64h0a12 12 0 0 1-12-12z" fill={INDIGO} />
        <rect x="28" y="30" width="34" height="5" rx="2.5" fill="#fff" opacity="0.9" />
        <rect x="28" y="41" width="22" height="5" rx="2.5" fill="#fff" opacity="0.6" />
      </g>
      {/* Правый пузырь (родители) */}
      <g className="illu-float" style={{ animationDelay: "1.1s" }}>
        <path d="M132 48a12 12 0 0 1 12-12h50a12 12 0 0 1 12 12v22a12 12 0 0 1-12 12h-12l14 12-24-12h-28a12 12 0 0 1-12-12z" fill={AMBER} />
        <rect x="146" y="48" width="36" height="5" rx="2.5" fill={INK} opacity="0.8" />
        <rect x="146" y="59" width="24" height="5" rx="2.5" fill={INK} opacity="0.45" />
      </g>
      {/* Отчёт между ними */}
      <g className="illu-pulse" style={{ animationDuration: "3.4s" }}>
        <rect x="96" y="52" width="30" height="40" rx="6" fill="#fff" stroke={INK} strokeWidth="3" />
        <rect x="102" y="60" width="12" height="4" rx="2" fill={CORAL} />
        <rect x="102" y="68" width="18" height="3" rx="1.5" fill="#dde0ea" />
        <rect x="102" y="75" width="14" height="3" rx="1.5" fill="#dde0ea" />
        <rect x="102" y="82" width="18" height="3" rx="1.5" fill={MINT} />
      </g>
    </svg>
  );
}
