"use client";

import { Lightbulb, TrendingUp } from "lucide-react";
import { useState } from "react";
import InfoShell from "@/components/info-shell";
import { hardSkills, mainSkills, softSkills } from "@/lib/info-data";

const tabs = [
  {
    key: "main",
    label: "Основные навыки",
    desc: "База, которая нужна в любой профессии",
    skills: mainSkills,
  },
  {
    key: "soft",
    label: "Soft skills",
    desc: "Гибкие навыки: общение, мышление, самоорганизация",
    skills: softSkills,
  },
  {
    key: "hard",
    label: "Hard skills",
    desc: "Профессиональные навыки, которым можно обучиться",
    skills: hardSkills,
  },
] as const;

export default function SkillsPage() {
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("main");
  const tab = tabs.find((t) => t.key === active)!;

  return (
    <InfoShell
      active="/skills"
      eyebrow="Справочник"
      title="Необходимые навыки"
      lede="Какие навыки ценят работодатели, где они пригодятся и как их развивать — основные, гибкие и профессиональные."
    >
      <div className="mb-3 flex justify-center">
        <div className="flex rounded-2xl bg-stone-100 p-1 text-sm font-medium">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`rounded-xl px-5 py-2.5 transition ${
                active === t.key
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-8 text-center text-sm text-stone-400">{tab.desc}</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tab.skills.map((s) => (
          <div
            key={s.name}
            className="rounded-3xl border border-stone-200 bg-white p-6 transition hover:border-violet-300 hover:shadow-[0_16px_40px_rgba(42,46,59,0.08)]"
          >
            <h3 className="font-display text-lg text-stone-800">{s.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              {s.desc}
            </p>
            <div className="mt-4 space-y-2.5 border-t border-stone-100 pt-4 text-sm">
              <p className="flex gap-2 text-stone-500">
                <Lightbulb size={15} className="mt-0.5 flex-none text-orange-400" />
                <span>
                  <span className="font-medium text-stone-600">
                    Где пригодится:
                  </span>{" "}
                  {s.example}
                </span>
              </p>
              <p className="flex gap-2 text-stone-500">
                <TrendingUp size={15} className="mt-0.5 flex-none text-violet-500" />
                <span>
                  <span className="font-medium text-stone-600">
                    Как развивать:
                  </span>{" "}
                  {s.develop}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </InfoShell>
  );
}
