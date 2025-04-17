import { Schema, model, models } from "mongoose";

// Esquema de cita
const appointmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    telephone: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true, // Fecha como texto en formato "yyyy-MM-dd"
    },
    time: { 
        type: String, 
        required: true, // Hora de la cita
    }, 
    status: {
      type: String,
      enum: ["Pendiente", "Confirmada", "Rechazada"],
      default: "Pendiente", // Estado inicial de la cita
    },
  },
  {
    timestamps: true, // Agrega campos de "createdAt" y "updatedAt"
  }
);

// Exporta el modelo si no ha sido registrado previamente
const Appointment = models.Appointment || model("Appointment", appointmentSchema);

export default Appointment;
