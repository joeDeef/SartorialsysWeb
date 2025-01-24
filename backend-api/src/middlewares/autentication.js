import jwt from 'jsonwebtoken';
const SECRET_KEY = 'mi_clave_secreta';


export const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied: no token provided' });
  }

  try {
    const verifiedUser = jwt.verify(token, SECRET_KEY);
    req.user = verifiedUser;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: you are not an administrator' });
  }
  next();
};