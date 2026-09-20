import { createAdminSession, endAdminSession, equal, isLocalAdminMode, sameOrigin } from "@/lib/cms/auth";
export const runtime="nodejs";
const failures=new Map<string,{count:number;until:number}>();
export async function POST(request: Request) {
  if(!sameOrigin(request)) return Response.json({error:"Недопустимый источник запроса"},{status:403});
  const key="admin-login";
  const limit=failures.get(key);
  if(limit && limit.until>Date.now() && limit.count>=10) return Response.json({error:"Слишком много попыток. Повторите через 15 минут."},{status:429});
  const {password}=await request.json();
  if(!(await isLocalAdminMode()) && !(process.env.ADMIN_PASSWORD && equal(String(password || ''),process.env.ADMIN_PASSWORD))) {
    failures.set(key,{count:limit && limit.until>Date.now() ? limit.count+1 : 1,until:Date.now()+15*60*1000});
    return Response.json({error:process.env.ADMIN_PASSWORD ? "Неверный пароль" : "Для входа настройте ADMIN_PASSWORD и AUTH_SECRET на сервере"},{status:401});
  }
  await createAdminSession(); failures.delete(key);
  return Response.json({ok:true});
}
export async function DELETE(request:Request) {
  if(!sameOrigin(request))return Response.json({error:"Недопустимый источник запроса"},{status:403});
  await endAdminSession();return Response.json({ok:true});
}
