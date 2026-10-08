const c = require('crypto');
const { setCookie, base } = require('../_lib');
module.exports = (req, res) => {
  const state = c.randomBytes(16).toString('hex');
  setCookie(res, 'fh_state', state, 600);
  const q = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: base(req) + '/api/auth/callback',
    response_type: 'code',
    scope: 'identify guilds.members.read',
    state
  });
  res.redirect(302, 'https://discord.com/oauth2/authorize?' + q);
};
