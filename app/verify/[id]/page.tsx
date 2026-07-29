import { BadgeCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";

// Публичная страница проверки подлинности сертификата (открывается по QR-коду)
export default async function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Мок: сертификат валиден, данные по ID
  const valid = id.startsWith("PRF-");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {valid ? (
        <>
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <ShieldCheck size={38} strokeWidth={1.75} />
          </span>
          <h1 className="font-display mt-6 text-2xl font-semibold tracking-tight">
            Сертификат действителен
          </h1>
          <p className="mt-2 max-w-md text-sm text-stone-500">
            Документ выпущен платформой «Профориентатор» и подтверждает
            прохождение полной программы подготовки педагога-профориентатора.
          </p>

          <div className="mt-8 w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 text-left">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <BadgeCheck size={16} className="text-emerald-600" />
              <span className="font-mono text-xs text-stone-400">{id}</span>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-stone-400">Владелец</dt>
                <dd className="font-medium">Гульнара Ахметова</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-400">Организация</dt>
                <dd className="font-medium">НИШ ФМН Астана</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-400">Программа</dt>
                <dd className="text-right font-medium">
                  Подготовка профориентатора
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-400">Дата выдачи</dt>
                <dd className="font-medium">28 июля 2026</dd>
              </div>
            </dl>
          </div>
        </>
      ) : (
        <>
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <ShieldCheck size={38} strokeWidth={1.75} />
          </span>
          <h1 className="font-display mt-6 text-2xl font-semibold tracking-tight">
            Сертификат не найден
          </h1>
          <p className="mt-2 max-w-md text-sm text-stone-500">
            Документ с идентификатором «{id}» не зарегистрирован на платформе.
          </p>
        </>
      )}

      <Link
        href="/"
        className="font-display mt-10 text-sm font-semibold tracking-tight text-stone-400 transition hover:text-stone-900"
      >
        профориентатор<span className="text-violet-600">.</span>
      </Link>
    </div>
  );
}
