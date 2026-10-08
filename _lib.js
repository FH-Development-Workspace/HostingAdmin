const c = require('crypto');
const sig = b => c.createHmac('sha256', process.env.SESSION_SECRET).update(b).digest('base64url');
const sign = p => { const b = Buffer.from(JSON.stringify(p)).toString('base64url'); return b + '.' + sig(b); };
const verify = t => {
  if (!t) return null;
  const [b, s] = t.split('.');
  if (!b || !s) return null;
  const e = sig(b);
  if (s.length !== e.length || !c.timingSafeEqual(Buffer.from(s), Buffer.from(e))) return null;
  try { const p = JSON.parse(Buffer.from(b, 'base64url')); return p.exp > Date.now() ? p : null; } catch { return null; }
};
const cookies = r => Object.fromEntries((r.headers.cookie || '').split(';').filter(Boolean).map(x => {
  const i = x.indexOf('='); return [x.slice(0, i).trim(), decodeURIComponent(x.slice(i + 1))];
}));
const session = r => verify(cookies(r).fh_session);
const setCookie = (res, n, v, age) => {
  const prev = res.getHeader('Set-Cookie') || [];
  res.setHeader('Set-Cookie', [].concat(prev, `${n}=${encodeURIComponent(v)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`));
};
const base = r => `https://${r.headers.host}`;
module.exports = { sign, cookies, session, setCookie, base };
