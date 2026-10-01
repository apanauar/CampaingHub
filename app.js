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