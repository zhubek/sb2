import { withPublishedContent } from "@/lib/cms/server";
import { notFound } from "next/navigation";
import { publishedTest } from "@/lib/cms/tests";
import CustomTest from "@/components/custom-test";
async function Page({params}:{params:Promise<{slug:string}>}) {const {slug}=await params;const test=publishedTest(slug);if(!test)notFound();return <CustomTest test={test}/>;}

export default withPublishedContent(Page);
