import bycryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import usuarioModel from '../models/usuario.model.js';

export const registerUser = async (userData) => {
   const  existeUsuario = await usuarioModel.findOne({ email: userData.email });
    if (existeUsuario) {
        const error = new Error('El usuario ya existe');
        error.status = 409;
        throw error;
    }
    const hashedPassword = await bycryptjs.hash(userData.password, Number(process.env.SALTING_ROUNDS));
    const nuevoUsuario = new usuarioModel({
        nombre: userData.nombre,
        email: userData.email,
        password: hashedPassword,
    });
    await nuevoUsuario.save();
    const token = jwt.sign({ id: nuevoUsuario._id, rol: nuevoUsuario.rol  , plan: nuevoUsuario.plan   }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return {usuario: { id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, rol: nuevoUsuario.rol , plan: nuevoUsuario.plan   }, token};
};

export const loginUser = async ({ email, password }) => {
    const usuario = await usuarioModel.findOne({ email });
    if (!usuario) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }
    const valido = await bycryptjs.compare(password, usuario.password);
    if (!valido) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }
    const token = jwt.sign({ id: usuario._id, rol: usuario.rol, plan: usuario.plan }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol, plan: usuario.plan }, token };
};