import {registerUser} from '../services/auth.services.js';
import {loginUser} from '../services/auth.services.js';

export const registerUserController = async (req, res) => {
const resultado = await registerUser(req.validatedBody);
res.status(201).json(resultado);
}


export const loginUserController = async (req, res) => {
    const resultado = await loginUser(req.validatedBody);
    res.status(200).json(resultado);
}