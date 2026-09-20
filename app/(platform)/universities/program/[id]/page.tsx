import { withPublishedContent } from "@/lib/cms/server";
import { notFound } from "next/navigation";
import { educationPrograms, institutionNames } from "@/lib/cms/programs";
import { getContent } from "@/lib/cms/server";
import EducationProgramView from "@/components/navigator/education-program-view";
async function Page({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;const source=educationPrograms.find(p=>p.id===id);if(!source)notFound();
  const program=getContent(id,source.value);const institution=getContent(`institution.${program.institutionId}`,{name:institutionNames.get(program.institutionId)||''});
  return <EducationProgramView program={program} institution={institution.name}/>;
}

export default withPublishedContent(Page);
