import UniversityList from "./university-list";

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string }>;
}) {
  const { industry } = await searchParams;
  return <UniversityList presetIndustry={industry ?? null} />;
}
