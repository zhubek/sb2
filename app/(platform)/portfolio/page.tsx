"use client";

import { Award, Calendar, FileBadge, FileText, Paperclip, Upload, X } from "lucide-react";
import { useState } from "react";
import { CertificateArt } from "@/components/brand-art";
import { portfolioItems } from "@/lib/mock-data";

type Item = (typeof portfolioItems)[number];

const years = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

export default function PortfolioPage() {
  const [items, setItems] = useState<Item[]>(portfolioItems);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Поля формы загрузки
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");

  const selected = items.find((p) => p.id === openItem);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setItems((list) => [
      {
        id: `p${Date.now()}`,
        name,
        date: year,
        year,
        type: "Сертификат",
        description,
        fileName: fileName || "dokument.pdf",
      },
      ...list,
    ]);
    setShowForm(false);
    setName("");
    setYear("");
    setDescription("");
    setFileName("");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Портфолио
          </h1>
          <p className="mt-1 text-stone-500">
            Дипломы, грамоты и сертификаты в одном месте
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex flex-none items-center gap-2 rounded-2xl bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
        >
          <Upload size={15} />
          Загрузить
        </button>
      </div>

      {/* Карточки документов: мини-превью, клик — подробный просмотр */}
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((p) => (
          <button
            key={p.id}
            onClick={() => setOpenItem(p.id)}
            className="group min-w-0 rounded-2xl border border-stone-200 bg-white p-4 text-left transition hover:border-violet-300"
          >
            <div className="rounded-xl bg-stone-50 px-6 py-4 transition group-hover:bg-violet-100/50">
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
      <button
        onClick={() => setShowForm(true)}
        className="block w-full rounded-2xl border border-dashed border-stone-300 py-10 text-center transition hover:border-violet-300"
      >
        <div className="c-shiver mx-auto w-56" style={{ animationDelay: "0.9s" }}>
          <CertificateArt className="w-56" />
        </div>
        <p className="mt-3 text-sm text-stone-500">
          Перетащите файл сюда или нажмите «Загрузить»
        </p>
        <p className="mt-1 text-xs text-stone-400">PNG, JPG, PDF · до 10 МБ</p>
      </button>

      {/* Форма загрузки достижения */}
      {showForm && (
        <div
          onClick={() => setShowForm(false)}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-stone-900/60 px-6 backdrop-blur-sm"
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md space-y-3.5 rounded-2xl bg-white p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setShowForm(false)}
              aria-label="Закрыть"
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:border-stone-900 hover:text-stone-900"
            >
              <X size={16} />
            </button>
            <h2 className="font-display text-lg">Новое достижение</h2>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Название сертификата"
              className={inputCls}
            />
            <select
              required
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputCls}
            >
              <option value="" disabled>
                Год вручения
              </option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание: за что получено, что было сделано…"
              rows={3}
              className={`${inputCls} resize-none`}
            />
            <label
              className={`flex cursor-pointer items-center gap-2.5 rounded-xl border border-dashed px-4 py-3 text-sm transition ${
                fileName
                  ? "border-teal-300 bg-teal-50 text-teal-700"
                  : "border-stone-300 text-stone-500 hover:border-violet-300"
              }`}
            >
              <Paperclip size={15} className="shrink-0" />
              <span className="truncate">
                {fileName || "Прикрепить файл (PNG, JPG или PDF)"}
              </span>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-2xl bg-violet-500 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600"
            >
              Сохранить в портфолио
            </button>
          </form>
        </div>
      )}

      {/* Подробный просмотр достижения */}
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
            <div className="mt-5">
              <p className="font-display text-lg leading-snug">{selected.name}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  {selected.type === "Диплом" ? (
                    <Award size={12} />
                  ) : (
                    <FileBadge size={12} />
                  )}
                  {selected.type}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {selected.year ?? selected.date}
                </span>
                {selected.fileName && (
                  <span className="flex items-center gap-1 font-mono">
                    <FileText size={12} />
                    {selected.fileName}
                  </span>
                )}
              </div>
              {selected.description && (
                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  {selected.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
