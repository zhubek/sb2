"use client";

import { Award, FileBadge, Upload, X } from "lucide-react";
import { useState } from "react";
import { CertificateArt } from "@/components/brand-art";
import { portfolioItems } from "@/lib/mock-data";

export default function PortfolioPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const selected = portfolioItems.find((p) => p.id === openItem);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Портфолио
          </h1>
          <p className="mt-1 text-stone-500">
            Дипломы, грамоты и сертификаты в одном месте
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700">
          <Upload size={15} />
          Загрузить
        </button>
      </div>

      {/* Карточки документов: мини-превью, клик — крупный просмотр */}
      <div className="grid gap-4 sm:grid-cols-2">
        {portfolioItems.map((p) => (
          <button
            key={p.id}
            onClick={() => setOpenItem(p.id)}
            className="group rounded-2xl border border-stone-200 bg-white p-4 text-left transition hover:border-violet-300"
          >
            <div className="rounded-xl bg-stone-50 px-6 py-4 transition group-hover:bg-violet-50/50">
              <CertificateArt className="mx-auto w-40" />
            </div>
            <div className="mt-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="mt-0.5 font-mono text-xs text-stone-400">
                  {p.date}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] text-stone-500">
                {p.type === "Диплом" ? (
                  <Award size={11} />
                ) : (
                  <FileBadge size={11} />
                )}
                {p.type}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Дропзона: сертификат периодически дрожит целиком */}
      <div className="rounded-2xl border border-dashed border-stone-300 py-10 text-center">
        <div className="c-shiver mx-auto w-56" style={{ animationDelay: "0.9s" }}>
          <CertificateArt className="w-56" />
        </div>
        <p className="mt-3 text-sm text-stone-500">
          Перетащите файл сюда или нажмите «Загрузить»
        </p>
        <p className="mt-1 text-xs text-stone-400">PDF, JPG, PNG · до 10 МБ</p>
      </div>

      {/* Просмотр документа крупно */}
      {selected && (
        <div
          onClick={() => setOpenItem(null)}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-stone-900/60 px-6 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl"
          >
            <button
              onClick={() => setOpenItem(null)}
              aria-label="Закрыть"
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:border-stone-900 hover:text-stone-900"
            >
              <X size={16} />
            </button>
            <CertificateArt className="mx-auto w-full max-w-md" />
            <div className="mt-4 text-center">
              <p className="font-display font-medium">{selected.name}</p>
              <p className="mt-1 font-mono text-xs text-stone-400">
                {selected.type} · {selected.date}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
