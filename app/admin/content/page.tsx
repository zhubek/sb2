import ContentLibrary from "@/components/admin/library";
import { groups, type Group } from "@/lib/cms/types";
export default async function Page({searchParams}:{searchParams:Promise<{group?:string;filter?:string}>}){const {group,filter}=await searchParams;return <ContentLibrary key={group||'all'} initialFilter={filter} group={group&&group in groups?group as Group:undefined}/>;}
