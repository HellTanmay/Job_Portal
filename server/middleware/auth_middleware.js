const jwt = require('jsonwebtoken');
const JWT_SECRET = 'wefihwofeiwfe778273973982303291801j0poiljhbbfdxfww'; // Same secret as in auth.js

function authMiddleware(req, res, next) {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid' });
  }
}

module.exports = authMiddleware;
