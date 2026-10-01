import mongoose from "mongoose";

// En Vercel la app corre como función serverless: puede arrancar y "dormirse" muchas veces.
// Por eso la conexión se pide antes de cada request y solo se abre si no está abierta.
const connectDB = async () => {
    // readyState 1 = conectado
    if (mongoose.connection.readyState === 1) {
        return;
    }
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
};

export default connectDB;
