"use client";

import { useState } from "react";

export default function SaveButton() {
  const [saved, setSaved] = useState(false);

  return (
    <button
      onClick={() => setSaved(!saved)}
      className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
        saved
          ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
          : "bg-violet-600 text-white hover:bg-violet-700"
      }`}
    >
      {saved ? "★ В избранном" : "☆ Сохранить в избранное"}
    </button>
  );
}
