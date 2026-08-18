"use client";

import { Globe2, MapPin } from "lucide-react";
import { useState } from "react";
import InfoShell from "@/components/info-shell";
import {
  type InfoUniversity,
  kzUniversities,
  worldUniversities,
} from "@/lib/info-data";

type Tab = "kz" | "world";

function UniCard({ u, world }: { u: InfoUniversity; world: boolean }) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 transition hover:border-violet-300 hover:shadow-[0_16px_40px_rgba(42,46,59,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg leading-snug text-stone-800">
          {u.name}
        </h3>
        <span className="flex flex-none items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-500">
          {world ? <Globe2 size={11} /> : <MapPin size={11} />}
          {u.place}
        </span>
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-stone-600">{u.desc}</p>
      {u.extra && (
        <p
          className={`mt-3 text-xs font-medium ${
            world ? "text-stone-400" : "text-violet-600"
          }`}
        >
          {world ? u.extra : `🌐 ${u.extra}`}
        </p>
      )}
    </div>
  );
}

export default function PopularUniversityPage() {
  const [tab, setTab] = useState<Tab>("kz");
  const list = tab === "kz" ? kzUniversities : worldUniversities;

  return (
    <InfoShell
      active="/popularuniversity"
      eyebrow="Справочник"
      title="Популярные университеты"
      lede="Ведущие вузы Казахстана и мира: чем они известны, какие направления в них сильны и где их искать."
    >
      <div className="mb-8 flex justify-center">
        <div className="flex rounded-2xl bg-stone-100 p-1 text-sm font-medium">
          {(
            [
              ["kz", `ВУЗы Казахстана · ${kzUniversities.length}`],
              ["world", `Мировые университеты · ${worldUniversities.length}`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-xl px-5 py-2.5 transition ${
                tab === key
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((u) => (
          <UniCard key={u.name} u={u} world={tab === "world"} />
        ))}
      </div>
    </InfoShell>
  );
}
