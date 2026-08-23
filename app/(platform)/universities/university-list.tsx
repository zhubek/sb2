"use client";

import { Compass, Target } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Navigator from "@/components/navigator/navigator";

export default function UniversityList({ presetIndustry }: { presetIndustry: string | null }) {
  // Баннер пресета скрывается по «Сбросить»; сам фильтр живёт в навигаторе
  const [showPreset, setShowPreset] = useState(Boolean(presetIndustry));
  const [key, setKey] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Навигатор образования</h1>
          <p className="mt-1 text-stone-500">
            Все вузы и колледжи Казахстана, зарубежные университеты и образовательные программы
          </p>
        </div>
        <Link
          href="/universities/industries"
          className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 px-4 py-2.5 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
        >
          <Compass size={15} />
          Отрасли и профессии
        </Link>
      </div>

      {showPreset && presetIndustry && (
        <div className="flex items-center justify-between rounded-2xl border border-violet-200 bg-violet-100 px-5 py-3.5 text-sm">
          <span>
            <Target size={15} className="mr-1.5 -mt-0.5 inline text-violet-600" />
            Фильтр по вашей отрасли: <span className="font-semibold">{presetIndustry}</span>
          </span>
          <button
            onClick={() => {
              setShowPreset(false);
              setKey((k) => k + 1);
            }}
            className="font-medium text-violet-600 hover:text-violet-700"
          >
            Сбросить
          </button>
        </div>
      )}

      <Navigator key={key} presetIndustry={showPreset ? presetIndustry : null} />
    </div>
  );
}
