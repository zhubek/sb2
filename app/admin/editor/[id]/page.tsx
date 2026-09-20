import { documentId } from "@/lib/cms/document-id";
import ContentEditor from "@/components/admin/editor";
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <ContentEditor key={documentId(id)} id={documentId(id)}/>;}
