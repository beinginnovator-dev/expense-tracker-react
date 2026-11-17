export async function onRequest({ request, env }) {
  const headers = { "Cache-Control": "no-store", "Content-Type": "application/json" };
  const json = (data, status=200) => new Response(JSON.stringify(data), {status, headers});
  if (request.method !== "POST") return json({error:"Method not allowed"},405);
  if (!env.ANALYTICS) return json({error:"Analytics unavailable"},503);
  try {
    const body = await request.json();
    const id = String(body.deviceId || "");
    if (!/^[a-f0-9-]{36}$/i.test(id)) return json({error:"Invalid device ID"},400);
    const now = Math.floor(Date.now()/1000);
    const installed = body.installed === true ? 1 : 0;
    await env.ANALYTICS.prepare(
      "INSERT INTO app_devices(device_id,first_seen,last_seen,is_installed,install_seen) VALUES(?,?,?,?,?) ON CONFLICT(device_id) DO UPDATE SET last_seen=excluded.last_seen,is_installed=MAX(app_devices.is_installed,excluded.is_installed),install_seen=CASE WHEN excluded.is_installed=1 THEN COALESCE(app_devices.install_seen,excluded.install_seen) ELSE app_devices.install_seen END"
    ).bind(id,now,now,installed,installed?now:null).run();
    return json({ok:true});
  } catch(e) { return json({error:"Analytics service unavailable"},500); }
}