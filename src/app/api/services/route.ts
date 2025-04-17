import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/utils/mongodb";
import Service from "@/modelo/Service";

export async function GET() {
  await connectDB();

  try {
    // Obtener todos los servicios incluyendo el promedio de valoraciones
    const services = await Service.find({}, {
      name: 1, // Incluir campos específicos
      description: 1,
      price: 1,
      vehicleType: 1,
      averageRating: 1, // Incluir el promedio de valoraciones
      featured: 1,
    });

    return NextResponse.json({ success: true, data: services }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los servicios:", error);
    return NextResponse.json({ success: false, message: "Error al obtener los servicios." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    // Leer el cuerpo de la solicitud
    const body = await req.json();

    // Validar que todos los campos requeridos estén presentes
    if (!body.name || !body.description || !body.price || !body.vehicleType) {
      return NextResponse.json(
        { success: false, message: "Por favor, proporciona todos los campos obligatorios." },
        { status: 400 }
      );
    }

    // Crear un nuevo servicio en la base de datos
    const newService = new Service(body);
    await newService.save();

    return NextResponse.json({ success: true, data: newService }, { status: 201 });
  } catch (error) {
    console.error("Error al crear el servicio:", error);
    return NextResponse.json({ success: false, message: "Error al crear el servicio." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    // Obtener el ID desde los parámetros de la URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Validar que el ID haya sido proporcionado
    if (!id) {
      return NextResponse.json({ success: false, message: "ID no proporcionado." }, { status: 400 });
    }

    // Eliminar el servicio con el ID proporcionado
    const deletedService = await Service.findByIdAndDelete(id);

    // Validar que el servicio haya sido encontrado y eliminado
    if (!deletedService) {
      return NextResponse.json({ success: false, message: "Servicio no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Servicio eliminado con éxito." }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar el servicio:", error);
    return NextResponse.json({ success: false, message: "Error al eliminar el servicio." }, { status: 500 });
  }
}

