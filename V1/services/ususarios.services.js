import jwt from 'jsonwebtoken';

export const cambiarPlan = async (idUsuario) => {
const usuario = await usuarioModel.findById(idUsuario);
if (!usuario) {
    throw new Error('Usuario no encontrado');
    error.status = 404;
}
if(usuario.rol === 'admin') {
    throw new Error('el administrador no gestiona planes');
    error.status = 403;
}
if(usuario.plan === 'premium') {
    throw new Error('el usuario ya es premium');
    error.status = 409;
}
usuario.plan = 'premium';
await usuario.save();

const token = jwt.sign({ id: usuario._id, rol: usuario.rol, plan: usuario.plan }, process.env.JWT_SECRET, { expiresIn: '1h' });
return { usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol, plan: usuario.plan }, token };
} 