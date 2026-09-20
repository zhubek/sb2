import { withPublishedContent } from "@/lib/cms/server";

import { ContentText } from "@/lib/cms/client";
import { getContent } from "@/lib/cms/server";
import Link from "next/link";
import { industryIcon, personaIndustries } from "@/components/navigator/industry-icons";
import { industryStats } from "@/lib/nav/industry-stats";
import { industries, industryRank } from "@/lib/nav/types";

// «Отрасли, которые тебе подходят» — по мотивам второго экрана прототипа
const cmsDefaults_industries = industries;
const cmsDefaults_industryRank = industryRank;

function IndustriesPage() {
  const industries = getContent("nav-meta.industries", cmsDefaults_industries);
  const industryRank = getContent("nav-meta.rank", cmsDefaults_industryRank);
  const main = personaIndustries.filter((n) => industries.some((i) => i.name === n));
  const extra = industryRank.filter((n) => !main.includes(n) && industries.some((i) => i.name === n)).slice(0, 2);
  const rest = industries.map((i) => i.name).filter((n) => !main.includes(n) && !extra.includes(n));

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link href="/universities" className="text-sm text-stone-400 hover:text-stone-600">
          <ContentText id="copy.app.platform.universities.industries.page.001" fallback="← К навигатору" /></Link>
        <p className="mt-5 text-xs font-medium tracking-[0.2em] text-stone-400 uppercase"><ContentText id="copy.app.platform.universities.industries.page.002" fallback="Рекомендации" /></p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight"><ContentText id="copy.app.platform.universities.industries.page.003" fallback="Отрасли, которые тебе подходят" /></h1>
        <p className="mt-2 text-stone-500">
          <ContentText id="copy.app.platform.universities.industries.page.004" fallback="Подобраны по твоим ведущим навыкам — креативность, коммуникация, эмпатия. Внутри каждой — направления, профессии и программы, где этому учат." /></p>
      </div>

      <section className="space-y-3">
        {main.map((n, i) => (
          <IndustryCard key={n} name={n} rank={i + 1} />
        ))}
      </section>

      <section>
        <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-stone-400 uppercase"><ContentText id="copy.app.platform.universities.industries.page.005" fallback="Также могут подойти" /></p>
        <div className="space-y-3">
          {extra.map((n) => (
            <IndustryCard key={n} name={n} />
          ))}
        </div>
      </section>

      <section>
        <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-stone-400 uppercase"><ContentText id="copy.app.platform.universities.industries.page.006" fallback="Все отрасли" /></p>
        <div className="grid gap-3 sm:grid-cols-2">
          {rest.map((n) => (
            <IndustryCard key={n} name={n} compact />
          ))}
        </div>
      </section>
    </div>
  );
}

function IndustryCardView({ name, rank, compact }: { name: string; rank?: number; compact?: boolean }) {
  const industries = getContent("nav-meta.industries", cmsDefaults_industries);
  const idx = industries.findIndex((i) => i.name === name);
  const meta = industries[idx];
  const s = industryStats(name);
  const Icon = industryIcon(name);
  return (
    <Link
      href={`/universities/industry/${idx}`}
      className="flex gap-4 rounded-2xl border p-5 transition hover:shadow-md"
      style={{ background: meta.cl, borderColor: meta.c + "33" }}
    >
      <span className="relative flex h-12 w-12 flex-none items-center justify-center rounded-2xl text-white" style={{ background: meta.c }}>
        <Icon size={22} />
        {rank && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 font-mono text-[10px] font-bold text-white">
            {rank}
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-display block font-semibold" style={{ color: meta.c }}>{name}</span>
        {!compact && <span className="mt-1 block text-sm text-stone-600">{meta.desc}</span>}
        <span className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
          <span><b className="text-stone-800">{s.p}</b> <ContentText id="copy.app.platform.universities.industries.page.007" fallback=" профессий" /></span>
          <span><b className="text-stone-800">{s.vop}</b> <ContentText id="copy.app.platform.universities.industries.page.008" fallback=" прогр. в вузах" /></span>
          <span><b className="text-stone-800">{s.cop}</b> <ContentText id="copy.app.platform.universities.industries.page.009" fallback=" в колледжах" /></span>
        </span>
      </span>
    </Link>
  );
}

// React renders child server components after the parent returns its JSX.
const IndustryCard=withPublishedContent(IndustryCardView);
export default withPublishedContent(IndustriesPage);
