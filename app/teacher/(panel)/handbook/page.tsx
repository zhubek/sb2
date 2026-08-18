import UniversityExplorer from "@/components/university-explorer";

// Раздел идентичен «Навигатору по ВУЗам» платформы ученика,
// но без возможности добавлять в Избранное (savable=false)
export default function HandbookPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Справочник образования</h1>
        <p className="mt-1 text-slate-500">
          Все казахстанские университеты и ~100 популярных зарубежных — те же
          данные, что видят ученики
        </p>
      </div>

      <UniversityExplorer
        tone="teal"
        detailBase="/teacher/handbook/university"
        savable={false}
      />
    </div>
  );
}
