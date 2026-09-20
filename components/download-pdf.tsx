"use client";
import { ContentText } from "@/lib/cms/client";


import { FileDown } from "lucide-react";

// «Скачать PDF»: открывает диалог печати — отчёт свёрстан под печать,
// сохранение в PDF даёт чистый документ без интерфейса платформы
export default function DownloadPdf() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600 print:hidden"
    >
      <FileDown size={15} />
      <ContentText id="copy.components.download-pdf.001" fallback="Скачать PDF" /></button>
  );
}
