import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

export const roleMiddleware = (roles = []) => (req, res, next) => {
  // roles: array de roles permitidos ['ADMIN','VENDEDOR']
  if (!roles.includes(req.usuario.rol)) {
    return res.status(403).json({ mensaje: 'No tienes permisos' });
  }
  next();
};

