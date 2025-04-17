import mongoose, { Schema, model, models} from "mongoose";

const ratingSchema = new Schema(
   {
    serviceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Service", 
        required: true, 
    }, // Relación con el servicio
    
    //userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },  Opcional: Relación con el usuario
    
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5, 
    }, // Valoración de 1 a 5 estrellas
    comment: { 
        type: String, 
        maxlength: 500 
    }, // Comentario del cliente
    createdAt: { 
        type: Date, 
        default: Date.now, 
    }, // Fecha de creación
    });

const Rating = models.Rating || model("Rating", ratingSchema);

export default Rating;
