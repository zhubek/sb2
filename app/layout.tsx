import { previewRequest } from "@/lib/cms/page-preview";
import { previewGuard } from "@/lib/cms/preview-guard";
import ContentLanguage from "@/components/content-language";
import { contentLocale } from "@/lib/cms/locale";
import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/lib/cms/client";
import { publishedValues } from "@/lib/cms/store";
import { defaultTests } from "@/lib/cms/test-defaults";
import type { Values } from "@/lib/cms/types";
export const dynamic = "force-dynamic";

const golos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-golos",
});

export const metadata: Metadata = {
  title: "AI профориентатор",
  description:
    "Цифровая платформа профориентации для казахстанских школьников: диагностика, AI-сопровождение и навигатор по университетам.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const preview = await previewRequest();
  if (preview.requested && !preview.snapshot) return <html lang="ru"><body><p style={{padding:30}}>Предпросмотр недоступен или истёк. Обновите его в редакторе.</p></body></html>;
  const locale = preview.snapshot?.locale ?? await contentLocale();
  return (
    <html lang={locale}>
      {preview.snapshot&&<head><script dangerouslySetInnerHTML={{__html:previewGuard(preview.snapshot.id,preview.snapshot.focus)}}/></head>}
      <body
        className={`${golos.variable} min-h-screen bg-[#fcfbfd] font-sans text-stone-800 antialiased`}
      >
        <ContentProvider locale={locale} previewPath={preview.snapshot?.route} values={{ ...Object.fromEntries(defaultTests.map(t => [`test.${t.slug}`, t])) as unknown as Values, ...await publishedValues() }}>{children}{!preview.snapshot&&<ContentLanguage locale={locale}/>}</ContentProvider>
      </body>
    </html>
  );
}
