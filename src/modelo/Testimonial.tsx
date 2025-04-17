import { Schema, model, models } from "mongoose";

// Define el esquema del testimonio con soporte multilingüe
const TestimonialSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      maxlength: [100, "El nombre no puede tener más de 100 caracteres"],
    },
    comment: {
      es: {
        type: String,
        required: [true, "El comentario en español es obligatorio"],
        trim: true,
        maxlength: [500, "El comentario no puede tener más de 500 caracteres"],
      },
      en: {
        type: String,
        required: [true, "El comentario en inglés es obligatorio"],
        trim: true,
        maxlength: [500, "El comentario no puede tener más de 500 caracteres"],
      }
    },
    createdAt: {
      type: Date,
      default: Date.now, // Por defecto, la fecha será la de creación
    },
    updatedAt: {
      type: Date, // Para almacenar la fecha de última edición
    },
  },
  { timestamps: true } // Crea automáticamente los campos `createdAt` y `updatedAt`
);

// Exporta el modelo para evitar conflictos si ya está definido
const Testimonial = models.Testimonial || model("Testimonial", TestimonialSchema);

export default Testimonial;
