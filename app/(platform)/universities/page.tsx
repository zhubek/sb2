import UniversityList from "./university-list";

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string; industry?: string }>;
}) {
  const { program, industry } = await searchParams;
  return (
    <UniversityList
      presetProgram={program ?? null}
      presetIndustry={industry ?? null}
    />
  );
}
