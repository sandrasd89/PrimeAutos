import { NextRequest, NextResponse } from "next/server"; // Cambiar a las nuevas clases de Next.js App Router
import { connectDB } from "@/utils/mongodb"; // Función para conectar con MongoDB
import ContactForm from "@/modelo/ContactForm"; // Modelo del mensaje

export async function POST(req: NextRequest) {
  await connectDB(); // Conectar a la base de datos

  try {
    const { name, email, message } = await req.json(); // Leer el cuerpo de la solicitud

    // Validar que los campos estén completos
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Por favor, completa todos los campos obligatorios.",
        },
        { status: 400 }
      );
    }

    // Crear un nuevo mensaje en la base de datos
    const newMessage = new ContactForm({ name, email, message });
    await newMessage.save();

    return NextResponse.json(
      {
        success: true,
        message: "Tu mensaje ha sido enviado con éxito.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al procesar el formulario:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Hubo un error al enviar tu mensaje. Intenta de nuevo más tarde.",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { Allow: "POST" } });
}
