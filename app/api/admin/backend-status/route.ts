import { isAdmin } from "@/lib/cms/auth";
export const dynamic="force-dynamic";
export async function GET(){
  if(!await isAdmin())return Response.json({error:'Нет доступа'},{status:401});
  try{const res=await fetch(`${process.env.API_URL||'http://localhost:3002/api'}/navigator/education-programs/status`,{cache:'no-store',signal:AbortSignal.timeout(3000)});if(!res.ok)throw new Error();const data=await res.json();return Response.json({state:data.state,count:data.count,lastSync:data.lastSync});}
  catch{return Response.json({state:'offline'});}
}
