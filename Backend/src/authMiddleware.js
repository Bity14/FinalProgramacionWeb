import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Obtener el token del encabezado de autorización
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, 'tu_secreto_jwt'); 
        req.user = decoded; // Agrega la información del usuario a `req` para usarla en la ruta
        next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

export default authMiddleware;
