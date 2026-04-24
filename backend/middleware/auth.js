// Simple Passport session guard — inline, no external dependency needed
export function requireAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  if (req.user) return next();
  return res.status(401).json({ error: 'Authentication required.' });
}

export function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'] || req.query.adminKey;
  if (key && key === process.env.ADMIN_SECRET_KEY) return next();
  return res.status(403).json({ error: 'Admin access required.' });
}
