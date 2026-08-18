"use client";

import { Target } from "lucide-react";
import { useState } from "react";
import UniversityExplorer from "@/components/university-explorer";

export default function UniversityList({
  presetProgram,
  presetIndustry,
}: {
  presetProgram: string | null;
  presetIndustry: string | null;
}) {
  // Баннер пресета скрывается по «Сбросить»; сам фильтр живёт в explorer
  const [showPreset, setShowPreset] = useState(
    Boolean(presetProgram || presetIndustry)
  );
  const [explorerKey, setExplorerKey] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Навигатор образования
        </h1>
        <p className="mt-1 text-stone-500">
          Вузы и колледжи Казахстана, зарубежные университеты и образовательные
          программы
        </p>
      </div>

      {showPreset && (
        <div className="flex items-center justify-between rounded-2xl border border-violet-200 bg-violet-50 px-5 py-3.5 text-sm">
          <span>
            <Target
              size={15}
              className="mr-1.5 -mt-0.5 inline text-violet-600"
            />
            {presetProgram ? (
              <>
                Фильтр по вашей программе:{" "}
                <span className="font-semibold">{presetProgram}</span>
              </>
            ) : (
              <>
                Фильтр по вашей отрасли:{" "}
                <span className="font-semibold">{presetIndustry}</span>
              </>
            )}
          </span>
          <button
            onClick={() => {
              setShowPreset(false);
              setExplorerKey((k) => k + 1); // пересоздать explorer без пресета
            }}
            className="font-medium text-violet-600 hover:text-violet-700"
          >
            Сбросить
          </button>
        </div>
      )}

      <UniversityExplorer
        key={explorerKey}
        tone="violet"
        detailBase="/universities"
        presetProgram={showPreset ? presetProgram : null}
        presetIndustry={showPreset ? presetIndustry : null}
      />
    </div>
  );
}
