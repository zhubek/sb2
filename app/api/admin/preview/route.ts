import { isAdmin, sameOrigin } from "@/lib/cms/auth";
import { withPreview } from "@/lib/cms/server";
import { getDocument } from "@/lib/cms/registry";
import { getInstitution, getDetail, buildInstitutionGroups, getGop, buildGopUnis, buildCollegeView } from "@/lib/nav/server";
export async function POST(request:Request) {
  if(!await isAdmin()||!sameOrigin(request))return Response.json({error:"Нет доступа"},{status:403});
  const text=await request.text();if(Buffer.byteLength(text)>3_000_000)return Response.json({error:"Материал слишком большой"},{status:413});
  try {
    const {id,value,locale}=JSON.parse(text);if(!getDocument(id))return Response.json({error:"Материал не найден"},{status:404});
    return Response.json(await withPreview({[id]:value},()=>{
      if(id.startsWith('institution.')){const d=getInstitution(Number(id.slice(12)));return {type:'institution',props:{d,detail:getDetail(d!.i),groups:buildInstitutionGroups(d!),savable:false}};}
      if(id.startsWith('gop.')){const g=getGop(id.slice(4));return {type:'gop',props:{g,unis:buildGopUnis(g!),savable:false}};}
      if(id.startsWith('college.'))return {type:'college',props:{p:buildCollegeView(id.slice(8)),savable:false}};
      return {type:'content'};
    },locale));
  }catch{return Response.json({error:"Заполните поля, чтобы обновить предпросмотр"},{status:422});}
}
