const { session } = require('./_lib');
const KEYS = ['customers', 'orders', 'payments', 'servers', 'moderation', 'pricing'];
const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = async cmd => {
  const r = await fetch(URL_, { method: 'POST', headers: { Authorization: 'Bearer ' + TOKEN }, body: JSON.stringify(cmd) });
  return (await r.json()).result;
};
module.exports = async (req, res) => {
  if (!session(req)) return res.status(401).json({ error: 'unauthorised' });
  if (!URL_ || !TOKEN) return res.status(500).json({ error: 'Database not connected: add the Upstash Redis variables in Vercel and redeploy.' });
  try {
    return await handle(req, res);
  } catch (e) {
    return res.status(500).json({ error: 'Database error: ' + e.message });
  }
};
const handle = async (req, res) => {
  if (req.method === 'GET') {
    const out = {};
    await Promise.all(KEYS.map(async k => { const v = await redis(['GET', 'fh:' + k]); out[k] = v ? JSON.parse(v) : null; }));
    return res.json(out);
  }
  if (req.method === 'PUT') {
    const { key, rows } = req.body || {};
    if (!KEYS.includes(key) || !Array.isArray(rows)) return res.status(400).json({ error: 'bad request' });
    await redis(['SET', 'fh:' + key, JSON.stringify(rows)]);
    return res.json({ ok: true });
  }
  res.status(405).end();
};
