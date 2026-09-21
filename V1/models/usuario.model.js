import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,

    },
    rol: {
        type: String,
        enum: ["admin", "marketer"],
        default: "marketer",
    },
    plan : {
        type: String,
        enum: ["plus", "premium"],
        default: "plus",
    }
    
},
{collection: "usuarios" , timestamps: true}
);

export default mongoose.model("Usuario", usuarioSchema);