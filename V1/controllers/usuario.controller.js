import { cambiarPlan } from "../services/ususarios.services.js";

export const  cambiarPlanController = async (req, res) => {
    const resultado = await cambiarPlan(req.user.id);
    res.status(200).json(resultado);
}