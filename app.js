import "dotenv/config";
import express from "express";
import cors from "cors";
import notFoundMiddleware from "./V1/middlewares/notFound.middleWare.js";
import {errorMiddleware} from "./V1/middlewares/error.middleware.js";
import connectDB from "./V1/config/db.config.js";
import v1 from "./V1/v1.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.json({ mensaje: "Campaign Hub API funcionando" });
});

// TEMPORAL (diagnóstico del deploy): muestra por qué no conecta la base. Se borra antes de entregar.
app.get("/diag", async (req, res) => {
    const uri = process.env.MONGO_URI || "";
    const info = { tieneUri: uri.length > 0, host: uri.split("@")[1] || null, largo: uri.length };
    try {
        await connectDB();
        res.json({ ...info, conectado: true });
    } catch (error) {
        res.status(503).json({ ...info, conectado: false, nombre: error.name, error: error.message });
    }
});

// Antes de atender cualquier ruta de la API, se asegura la conexión a la base.
// Si la base no responde: 503 (servicio no disponible) en vez de dejar el request colgado.
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error(`Error de conexión a MongoDB: ${error.message}`);
        res.status(503).json({ error: "Base de datos no disponible, intentá de nuevo en unos segundos" });
    }
});
app.use("/v1", v1);



app.use(notFoundMiddleware );
app.use(errorMiddleware);




export default app;