
import { ContentText } from "@/lib/cms/client";
import Navigator from "@/components/navigator/navigator";

// Раздел идентичен «Навигатору образования» платформы ученика — те же данные
// (938 заведений, ГОП, специальности колледжей), но без избранного
export default function HandbookPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold"><ContentText id="copy.app.teacher.panel.handbook.page.001" fallback="Справочник образования" /></h1>
        <p className="mt-1 text-slate-500">
          <ContentText id="copy.app.teacher.panel.handbook.page.002" fallback="Все вузы и колледжи Казахстана, зарубежные университеты и образовательные программы — те же данные, что видят ученики" /></p>
      </div>
      <Navigator base="/teacher/handbook" savable={false} />
    </div>
  );
}
