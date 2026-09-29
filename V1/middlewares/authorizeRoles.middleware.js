export const authorizeRoles = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
        return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
    }
    next();
};