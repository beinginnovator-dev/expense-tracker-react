export async function onRequest({request,env}) {
  const headers={"Cache-Control":"no-store","Content-Type":"application/json","Access-Control-Allow-Origin":"*"};
  if(request.method!=="GET")return new Response(JSON.stringify({error:"Method not allowed"}),{status:405,headers});
  if(!env.ANALYTICS)return new Response(JSON.stringify({}),{headers});
  try{
    const row=await env.ANALYTICS.prepare("SELECT trigger,title,message,url,image_url,frequency FROM promo_config WHERE id=1").first();
    return new Response(JSON.stringify(row||{trigger:"disabled",title:"",message:"",url:"",image_url:"",frequency:"once_session"}),{headers});
  }catch(e){return new Response(JSON.stringify({}),{headers});}
}