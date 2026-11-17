export async function onRequest({request,env}) {
  const headers={"Cache-Control":"no-store","Content-Type":"application/json"};
  const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
  // This route must be covered by the Cloudflare Access application at /creator/*.
  // Access authenticates the user at the edge and injects this assertion header.
  if(!request.headers.get("Cf-Access-Jwt-Assertion"))return json({error:"Creator authentication required"},401);
  if(!env.ANALYTICS)return json({error:"Analytics database unavailable"},503);
  try{
    if(request.method==="GET"){
      const now=Math.floor(Date.now()/1000);
      const stats=await env.ANALYTICS.prepare("SELECT COUNT(*) AS totalDevices, SUM(CASE WHEN last_seen>=? THEN 1 ELSE 0 END) AS onlineNow, SUM(is_installed) AS installedDevices, SUM(CASE WHEN first_seen>=? THEN 1 ELSE 0 END) AS newToday FROM app_devices").bind(now-90,now-86400).first();
      const promo=await env.ANALYTICS.prepare("SELECT trigger,title,message,url,image_url,frequency FROM promo_config WHERE id=1").first();
      return json({stats:{onlineNow:stats?.onlineNow||0,installedDevices:stats?.installedDevices||0,totalDevices:stats?.totalDevices||0,newToday:stats?.newToday||0},promo:promo||{trigger:"disabled",title:"",message:"",url:"",frequency:"once_session"}});
    }
    if(request.method==="POST"){
      const body=await request.json();
      const trigger=["disabled","app_open","tab_open","both"].includes(body.trigger)?body.trigger:"disabled";
      const frequency=["once_session","daily","every_event"].includes(body.frequency)?body.frequency:"once_session";
      const title=String(body.title||"").slice(0,120);
      const message=String(body.message||"").slice(0,1000);
      const url=String(body.url||"").trim();
      const imageUrl=String(body.image_url||"").trim();
      if(url && !/^https:\/\//i.test(url))return json({error:"Promotion link must use HTTPS"},400);
      await env.ANALYTICS.prepare("INSERT INTO promo_config(id,trigger,title,message,url,image_url,frequency,updated_at) VALUES(1,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET trigger=excluded.trigger,title=excluded.title,message=excluded.message,url=excluded.url,image_url=excluded.image_url,frequency=excluded.frequency,updated_at=excluded.updated_at").bind(trigger,title,message,url,imageUrl,frequency,Math.floor(Date.now()/1000)).run();
      return json({ok:true});
    }
    return json({error:"Method not allowed"},405);
  }catch(e){return json({error:"Creator service unavailable"},500);}
}