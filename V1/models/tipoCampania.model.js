import mongoose from 'mongoose';
const tipoCampaniaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    descripcion: {
        type: String,
        default: ""
    }
},{ collection: "tiposCampania", timestamps: true });
export default mongoose.model("TipoCampania", tipoCampaniaSchema);