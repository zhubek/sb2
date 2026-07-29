import UniversityList from "./university-list";

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string }>;
}) {
  const { program } = await searchParams;
  return <UniversityList presetProgram={program ?? null} />;
}
