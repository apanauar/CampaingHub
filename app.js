import "dotenv/config";
import express from "express";
import cors from "cors";
import notFoundMiddleware from "./V1/middlewares/notFound.middleWare.js";
import {errorMiddleware} from "./V1/middlewares/error.middleware.js";
import connectDB from "./V1/config/db.config.js";
import v1 from "./V1/v1.routes.js";

const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.json({ mensaje: "Campaign Hub API funcionando" });
});
app.use("/v1", v1);



app.use(notFoundMiddleware );
app.use(errorMiddleware);




export default app;