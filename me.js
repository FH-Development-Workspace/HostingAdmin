const { session } = require('./_lib');
module.exports = (req, res) => {
  const s = session(req);
  if (!s) return res.status(401).json({ error: 'unauthorised' });
  res.json({ id: s.id, name: s.name });
};
