import "dotenv/config" ; 
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import usuarioModel from "./V1/models/usuario.model.js";


await mongoose.connect(process.env.MONGO_URI) ; 

const existe = await usuarioModel.findOne({ email: "admin@campaignhub.com" });
if (!existe) {
    await usuarioModel.create({
        nombre: "Administrador",
        email: "admin@campaignhub.com",
        password: await bcryptjs.hash("Admin12345", Number(process.env.SALT_ROUNDS)),
        rol: "admin",
        plan: "plus"
    });
    console.log("Usuario administrador creado");
}
else {
    console.log("Usuario administrador ya existe");
}
await mongoose.disconnect() ;