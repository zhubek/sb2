"use client";

import { useState } from "react";

// Горизонтальные бары: одна серия, идентичность несут подписи строк
export default function BarList({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-3.5">
      {data.map((d, i) => (
        <div
          key={d.name}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
        >
          <div className="flex justify-between text-sm">
            <span className={hover === i ? "font-medium" : ""}>{d.name}</span>
            <span className="font-medium text-slate-500">{d.value}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-colors ${
                hover === i ? "bg-teal-700" : "bg-teal-600"
              }`}
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
