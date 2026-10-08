const { setCookie } = require('./_lib');
module.exports = (req, res) => { setCookie(res, 'fh_session', '', 0); res.redirect(302, '/'); };
