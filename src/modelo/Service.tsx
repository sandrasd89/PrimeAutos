import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: {
    es: { type: String, required: true },
    en: { type: String, required: true } 
  },
  description: { 
    es: { type: String, required: true },
    en: { type: String, required: true }
  },
  price: { 
    type: String, 
    required: true 
  },
  vehicleType: { 
    type: String, 
    required: true,
    enum: ["Automóvil", "Motocicleta", "Camión"],
  },
  featured: {
    type: Boolean,
    default: false, //por defecto no es un servicio destacado
  },
  averageRating: {
    type: Number, // Campo para el promedio de valoraciones
    default: 0,
  },

});

export default mongoose.models.Service || mongoose.model("Service", serviceSchema);

