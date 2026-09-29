import mongoose from "mongoose";

const campaniaSchema = new mongoose.Schema({
    nombre: { 
        type: String,
         required: true,
          trim: true 
        },
    cliente: {
         type: String, 
        required: true, 
        trim: true
     },
    tipo: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "TipoCampania", required: true 
    }, 
    objetivo: {
         type: String,
          default: ""
         },
    canales: [{ 
        type: String, 
        enum: ["instagram", "tiktok", "meta_ads", "google_ads", "linkedin", "email"]
     }],
    presupuesto: 
    { type: Number,
         min: 0, 
         default: 0 
    },
    fechaInicio: { 
        type: Date,
         required: true 
        },
    fechaFin: { 
        type: Date,
         required: true 
        },
    estado: { 
        type: String, 
        enum: ["borrador", "activa", "pausada", "finalizada"], 
        default: "borrador" 
    },
    piezas: [{ url: String, 
        publicId: String, 
        descripcion: String 
        }],   
    brief: { 
        type: String,
         default: null 
        },
    ideasCopy: [{
         type: String 
        }],                                      
    feriadosEnRango: [{ 
        fecha: String, 
        nombre: String 
    }],               
    owner: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario", required: true 
    }
}, { collection: "campanias", timestamps: true });

export default mongoose.model("Campania", campaniaSchema);