import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import Service from "@/modelo/Service"; // Modelo del servicio
import Rating from "@/modelo/Rating";


//export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
export async function GET(req: NextRequest, context: { params : { id: string }}) {

  try {
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID no proporcionado." },
        { status: 400 }
      );
    }

    await connectDB();

    // Buscar el servicio por ID
    const service = await Service.findById(id).lean(); // Obtener el servicio específico

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Servicio no encontrado." },
        { status: 404 }
      );
    }

    // Obtener todas las valoraciones relacionadas con el servicio
    const ratings = await Rating.find({ serviceId: id });

    // Calcular el promedio de valoraciones
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    // Retornar el servicio junto con sus valoraciones y promedio
    return NextResponse.json(
      {
        success: true,
        data: { ...service, ratings, averageRating },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener datos del servicio:", error);
    return NextResponse.json(
      { success: false, message: "Hubo un error al procesar la solicitud." },
      { status: 500 }
    );
  }
}

export const PATCH = async (req: NextRequest, context: { params: { id: string } }) => {
 
  try {
    //const params = await context.params; // Extraer el ID de los parámetros
    const params  = await context.params; 
    //console.log("Resolved params:", params);

    const id = (params.id || "").trim();

    if (!id) {
      return NextResponse.json({ message: "ID no proporcionado." }, { status: 400 });
    }

    const body = await req.json(); // Leer el cuerpo de la solicitud
    console.log("Request body:", body);
    
    // Verificar que el cuerpo no esté vacío
    if (!body || !Object.keys(body).length) {
      return NextResponse.json({ message: "El cuerpo de la solicitud está vacío." }, { status: 400 });
    }
    await connectDB();
    // Buscar el servicio por ID y actualizarlo
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { $set: body }, // Actualizar los campos proporcionados en el cuerpo
      {
        new: true, // Retorna el documento actualizado
        runValidators: true, // Ejecuta validaciones del esquema
      }
    );

    if (!updatedService) {
      return NextResponse.json({ message: "Servicio no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ data: updatedService, message: "Servicio actualizado correctamente." }, { status: 200});
  } catch (error) {
    console.error("Error al actualizar el servicio:", error);
    return NextResponse.json({ message: "Error interno al actualizar el servicio." }, { status: 500 });
  }
}

export const DELETE = async (req: NextRequest, context: { params: { id: string } }) => {
  
  try {

    //const params = await context.params;
    //console.log("resolved params for DELETE:", params);
    const { id } = context.params;

    //if (!params.id) {
    if (!id) {
      return NextResponse.json({ succes: false, message: "ID inválido." }, { status: 400 });
    }
    
    //const { id } = params; // Extraer el ID de los parámetros
    await connectDB();

    // Buscar y eliminar el servicio por ID
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return NextResponse.json(
        { success: false, message: "Servicio no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Servicio eliminado con éxito." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el servicio:", error);
    return NextResponse.json(
      { message: "Error interno al eliminar el servicio." },
      { status: 500 }
    );
  }
}

