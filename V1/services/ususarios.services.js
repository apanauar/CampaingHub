import jwt from 'jsonwebtoken';
import usuarioModel from '../models/usuario.model.js';

export const cambiarPlan = async (idUsuario) => {
const usuario = await usuarioModel.findById(idUsuario);
if (!usuario) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
}
if(usuario.rol === 'admin') {
    const error = new Error('el administrador no gestiona planes');
    error.status = 403;
    throw error;
        
}
if(usuario.plan === 'premium') {
    const error = new Error('el usuario ya es premium');
    error.status = 409;
    throw error;
}
usuario.plan = 'premium';
await usuario.save();

const token = jwt.sign({ id: usuario._id, rol: usuario.rol, plan: usuario.plan }, process.env.JWT_SECRET, { expiresIn: '1h' });
return { usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol, plan: usuario.plan }, token };
} 