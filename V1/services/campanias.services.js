import {isValidObjectId} from  "mongoose";
import campaniaModel from "../models/campania.model.js";
import tipoCampaniaModel from "../models/tipoCampania.model.js";
import cloudinary from "../config/cloudinary.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.util.js";
import { groqService } from "./ai.services.js";
const crearError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    return error;
};


const LIMITE_PLAN_PLUS = 4 ; 

const TRASICIONES = {
    borrador : ["activa"],
    activa : ["pausada", "finalizada"],
    pausada : ["activa", "finalizada"],
    finalizada : []
}

export const listarCampanias = async (usuario , busqueda ) => {
    let {limit= 10, page=1, estado, tipo , cliente , canal , nombre} = busqueda;
    limit  = Number(limit);
    page = Number(page);
    const skip = (page - 1) * limit; 
    
    const criterio = {} ;
    if(usuario.rol !== "admin") {
        criterio.owner = usuario.id;
    }
    if(estado) {
        criterio.estado = estado;
    }
    if(tipo && isValidObjectId(tipo)) {
        criterio.tipo = tipo;
    }
    if(cliente) {
        criterio.cliente =  cliente;
    }
    if(canal) {
        criterio.canales = canal;
    }
    if(nombre) {
        criterio.nombre = nombre;
    }

    const campanias = await campaniaModel.find(criterio)
        .populate("tipo", "nombre")
        .skip(skip)
        .limit(limit)

    const campaniasTotales = await campaniaModel.countDocuments(criterio);
    const totalPages = Math.ceil(campaniasTotales / limit);
    
    return {
        campanias,
        total: campaniasTotales,
        totalPages,
        currentPage: page
    };
}

export const obtenerCampania = async (usuario, id) => {
    if (!isValidObjectId(id)) {
        throw crearError("El id de la campaña no es válido", 400);
    }

    const criterio = { _id: id };
    if (usuario.rol !== "admin") {
        criterio.owner = usuario.id;
    }

    const campanias = await campaniaModel.find(criterio).populate("tipo", "nombre");
    if (campanias.length === 0) {
        throw crearError("Campaña no encontrada", 404);
    }
    return campanias[0];
};

export const crearCampania = async (usuario, datos) => {
    if(usuario.rol === "admin") {
        throw crearError("Los administradores no pueden crear campañas", 403);
    }
    
    if(usuario.plan === "plus" ){
        const cantidad = await campaniaModel.countDocuments({owner : usuario.id})
        if(cantidad>= LIMITE_PLAN_PLUS){
            throw crearError(`El plan Plus permite hasta ${LIMITE_PLAN_PLUS} campañas. Pasate a Premium para crear ilimitadas`, 403)
        }
    }
    

    const tipo = await tipoCampaniaModel.findById(datos.tipo)
    if(!tipo){
        throw crearError("El tipo de campaña no existe", 404);
    }

    const nuevaCampania = new campaniaModel({...datos, owner: usuario.id}) ; 
    await nuevaCampania.save()
    await nuevaCampania.populate("tipo","nombre")
    return nuevaCampania ; 
}

export const actualizarCampania = async (usuario , id , datos )=>{
    const campania = await obtenerCampania(usuario,id) ; 

    if(datos.tipo){
        const tipo = await tipoCampaniaModel.findById(datos.tipo)
        if(!tipo){
            throw crearError ("El tipo de campaña no existe", 404)
        }
    }

    if(datos.estado && datos.estado !== campania.estado){
        if(!TRASICIONES[campania.estado].includes(datos.estado)){
            throw crearError(`No se puede pasar de "${campania.estado}" a "${datos.estado}"`, 409);
        }
    }

    const inicio = datos.fechaInicio ? new Date(datos.fechaInicio) : new Date(campania.fechaInicio);
    const fin = datos.fechaFin ? new Date(datos.fechaFin) : new Date(campania.fechaFin);
    if (fin < inicio) {
        throw crearError("La fecha de fin no puede ser anterior a la de inicio", 400);
    }

    const campaniaActualizada = await campaniaModel.findByIdAndUpdate(id, datos, { returnDocument: "after" })
        .populate("tipo", "nombre");
    return campaniaActualizada;
}


export const eliminarCampania = async (usuario, id) => {
    await obtenerCampania(usuario, id);
    const campaniaEliminada = await campaniaModel.findByIdAndDelete(id);
    return campaniaEliminada;
};


export const resumenPlan = async (usuario) => {
    const usadas = await campaniaModel.countDocuments({ owner: usuario.id });
    const esPlus = usuario.plan === "plus";
    return {
        plan: usuario.plan,
        campaniasUsadas: usadas,
        limite: esPlus ? LIMITE_PLAN_PLUS : null,
        disponibles: esPlus ? Math.max(0, LIMITE_PLAN_PLUS - usadas) : null
    };
};


export const agregarPieza = async (usuario, id, archivo) => {
    const campania = await obtenerCampania(usuario, id);  

    const resultado = await uploadBufferToCloudinary(cloudinary, archivo.buffer, {
        resource_type: "image",
        folder: "campaign-hub/campanias"
    });

    campania.piezas.push({
        url: resultado.secure_url,
        publicId: resultado.public_id,
        descripcion: archivo.originalname
    });
    await campania.save();
    return campania;
};


// IA en un flujo genera brief mas ideas de copy a partir de los datos de la campaña.
// Si Groq no responde usa un fallback
export const generarBrief = async (usuario, id) => {
    const campania = await obtenerCampania(usuario, id);

    const prompt = `Sos un estratega de marketing. Escribí un brief de máximo 100 palabras
y 3 ideas de copy para redes para esta campaña.
Respondé SOLO con este formato, en texto plano, sin markdown ni asteriscos:
BRIEF: texto del brief
COPY: idea 1
COPY: idea 2
COPY: idea 3

Campaña: ${campania.nombre}
Cliente: ${campania.cliente}
Tipo: ${campania.tipo.nombre}
Objetivo: ${campania.objetivo}
Canales: ${campania.canales.join(", ")}
Presupuesto: ${campania.presupuesto}`;

    let respuesta = "";
    let generadoPorIA = true;
    try {
        respuesta = await groqService(prompt);
    } catch (error) {
        generadoPorIA = false;
    }

    let brief = "";
    const ideasCopy = [];
    if (generadoPorIA) {
        const lineas = respuesta.split("\n");
        for (const lineaOriginal of lineas) {
            const linea = lineaOriginal.replaceAll("*", "").trim();   // por si la IA igual manda **negritas**
            if (linea.startsWith("BRIEF:")) {
                brief = linea.replace("BRIEF:", "").trim();
            }
            if (linea.startsWith("COPY:")) {
                ideasCopy.push(linea.replace("COPY:", "").trim());
            }
        }
    }

    // Fallback: la IA falló o no respetó el formato pedido
    if (!brief) {
        generadoPorIA = false;
        brief = `Campaña "${campania.nombre}" para ${campania.cliente}. Objetivo: ${campania.objetivo || "a definir"}. Canales: ${campania.canales.join(", ")}.`;
        ideasCopy.length = 0;
        ideasCopy.push(`${campania.cliente}: lo que estabas esperando.`);
        ideasCopy.push(`Descubrí ${campania.nombre} en ${campania.canales[0] || "nuestras redes"}.`);
        ideasCopy.push(`No te quedes afuera: ${campania.nombre}.`);
    }

    campania.brief = brief;
    campania.ideasCopy = ideasCopy;
    await campania.save();
    return { campania, generadoPorIA };
};


// API externa Nager.Date (feriados públicos por país).
// Devuelve los feriados de Uruguay que caen dentro de las fechas de la campaña
// y los guarda en la campaña (feriadosEnRango) para no tener que volver a pedirlos.
const URL_FERIADOS = "https://date.nager.at/api/v3/PublicHolidays";
const PAIS = "UY";

export const obtenerFeriados = async (usuario, id) => {
    const campania = await obtenerCampania(usuario, id);

    const inicio = new Date(campania.fechaInicio);
    const fin = new Date(campania.fechaFin);
    const feriados = [];

    for (let anio = inicio.getUTCFullYear(); anio <= fin.getUTCFullYear(); anio++) {
        let respuesta;
        try {
            respuesta = await fetch(`${URL_FERIADOS}/${anio}/${PAIS}`);
        } catch (error) {
            throw crearError("El servicio de feriados no está disponible, probá más tarde", 503);
        }
        if (!respuesta.ok) {
            throw crearError("El servicio de feriados no está disponible, probá más tarde", 503);
        }

        const lista = await respuesta.json();
        for (const feriado of lista) {
            const fecha = new Date(feriado.date);
            if (fecha >= inicio && fecha <= fin) {
                feriados.push({ fecha: feriado.date, nombre: feriado.localName });
            }
        }
    }

    campania.feriadosEnRango = feriados;
    await campania.save();
    return { cantidad: feriados.length, feriados, campania };
};
