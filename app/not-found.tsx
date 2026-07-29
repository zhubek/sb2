import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LostArt } from "@/components/brand-art";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <LostArt className="h-52 w-52" />
      <p className="font-mono mt-6 text-sm text-stone-400">404</p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
        Кажется, мы сбились с курса
      </h1>
      <p className="mt-3 max-w-md text-stone-500">
        Такой страницы нет. Но компас всегда найдёт дорогу обратно — к тестам,
        рекомендациям и вашему будущему университету.
      </p>
      <Link
        href="/dashboard"
        className="group mt-8 flex items-center gap-2 rounded-full bg-stone-900 py-3 pr-7 pl-5 text-sm font-medium text-white transition hover:bg-violet-700"
      >
        <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
        В личный кабинет
      </Link>
    </div>
  );
}
