const { cookies, sign, setCookie, base } = require('../_lib');
const ROLE = process.env.DISCORD_ROLE_ID || '1557771113885335603';
module.exports = async (req, res) => {
  const { code, state } = req.query;
  if (!code || !state || state !== cookies(req).fh_state) return res.redirect(302, '/?error=auth');
  try {
    const t = await (await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: base(req) + '/api/auth/callback'
      })
    })).json();
    if (!t.access_token) return res.redirect(302, '/?error=auth');
    const r = await fetch(`https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`, {
      headers: { Authorization: 'Bearer ' + t.access_token }
    });
    if (!r.ok) return res.redirect(302, '/?error=denied');
    const m = await r.json();
    if (!(m.roles || []).includes(ROLE)) return res.redirect(302, '/?error=denied');
    const age = 8 * 3600;
    setCookie(res, 'fh_session', sign({
      id: m.user.id,
      name: m.nick || m.user.global_name || m.user.username,
      exp: Date.now() + age * 1000
    }), age);
    setCookie(res, 'fh_state', '', 0);
    res.redirect(302, '/');
  } catch (e) { res.redirect(302, '/?error=auth'); }
};
