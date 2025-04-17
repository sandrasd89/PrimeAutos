import { NextRequest, NextResponse } from "next/server"; // Clases de Next.js App Router
import { connectDB } from "@/utils/mongodb"; // Conectar a MongoDB
import Rating from "@/modelo/Rating"; // Modelo de valoraciones
import Service from "@/modelo/Service";

export async function POST(req: NextRequest) {
  await connectDB(); // Conexión a la base de datos

  try {
    const body = await req.json();
    const { serviceId, rating, comment } = body; // Leer el cuerpo de la solicitud

    // Validar que los campos estén completos
    if (!serviceId || typeof rating !== "number") {
      return NextResponse.json(
        {
          success: false,
          message: "Por favor, completa todos los campos obligatorios.",
        },
        { status: 400 }
      );
    }

    // Validar el rango de la valoración (1 a 5)
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "La valoración debe estar entre 1 y 5 estrellas.",
        },
        { status: 400 }
      );
    }

    // Crear una nueva valoración en la base de datos
    //const newRating = await Rating.create({ serviceId, rating, comment });

    const newRating = new Rating(body);
    await newRating.save();

    // Recalcular el promedio de valoraciones para el servicio

    const allRatings = await Rating.find({ serviceId }); // Obtener todas las valoraciones asociadas al servicio
    const averageRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length; // Calcular promedio

    // Actualizar el modelo de servicio con el nuevo promedio
    //await Service.findByIdAndUpdate(serviceId, { $set: { averageRating } });
    await Service.findByIdAndUpdate(serviceId, { averageRating });
    
    return NextResponse.json(
      {
        success: true,
        message: "Tu valoración ha sido registrada con éxito.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar la valoración:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Hubo un error al registrar tu valoración. Intenta de nuevo más tarde.",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { Allow: "POST" } });
}

