export async function onRequest({ request, env }) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store"
  };
  if (request.method === "OPTIONS") return new Response(null, { headers: cors });
  const json = (data, status=200) => new Response(JSON.stringify(data), {
    status, headers: { ...cors, "Content-Type": "application/json" }
  });
  if (!env.ANALYTICS) return json({ error: "Analytics database is not configured" }, 503);
  try {
    if (request.method === "POST") {
      const body = await request.json();
      const id = String(body.deviceId || "");
      if (!/^[a-f0-9-]{36}$/i.test(id)) return json({ error: "Invalid device ID" }, 400);
      const now = Math.floor(Date.now()/1000);
      const installed = body.installed === true ? 1 : 0;
      await env.ANALYTICS.prepare(
        "INSERT INTO app_devices(device_id,first_seen,last_seen,is_installed,install_seen) VALUES(?,?,?,?,?) ON CONFLICT(device_id) DO UPDATE SET last_seen=excluded.last_seen,is_installed=MAX(app_devices.is_installed,excluded.is_installed),install_seen=CASE WHEN excluded.is_installed=1 THEN COALESCE(app_devices.install_seen,excluded.install_seen) ELSE app_devices.install_seen END"
      ).bind(id, now, now, installed, installed ? now : null).run();
      return json({ ok: true });
    }
    if (request.method === "GET") {
      const now = Math.floor(Date.now()/1000);
      const row = await env.ANALYTICS.prepare(
        "SELECT COUNT(*) AS totalDevices, SUM(CASE WHEN last_seen>=? THEN 1 ELSE 0 END) AS onlineNow, SUM(is_installed) AS installedDevices, SUM(CASE WHEN first_seen>=? THEN 1 ELSE 0 END) AS newToday FROM app_devices"
      ).bind(now-90, now-86400).first();
      return json({
        onlineNow: row?.onlineNow || 0,
        installedDevices: row?.installedDevices || 0,
        totalDevices: row?.totalDevices || 0,
        newToday: row?.newToday || 0,
        onlineWindowSeconds: 90,
        note: "Anonymous device counts only. No names, email addresses, or IP addresses are stored."
      });
    }
    return json({ error: "Method not allowed" }, 405);
  } catch (e) {
    return json({ error: "Analytics service unavailable" }, 500);
  }
}