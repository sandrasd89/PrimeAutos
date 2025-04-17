/*import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import Service from "@/modelo/Service";
import Rating from "@/modelo/Rating";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    // Obtener el ID del servicio desde los parámetros de la URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID no proporcionado." }, { status: 400 });
    }

    // Buscar el servicio por su ID
    const service = await Service.findById(id).lean();

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Servicio no encontrado." },
        { status: 404 }
      );
    }

    // Buscar todas las valoraciones asociadas al servicio
    const ratings = await Rating.find({ serviceId: id });

    // Calcular el promedio de valoraciones
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    // Retornar los datos del servicio junto con valoraciones y el promedio
    return NextResponse.json(
      {
        success: true,
        data: { ...service, ratings, averageRating },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener los datos del servicio:", error);
    return NextResponse.json(
      { success: false, message: "Hubo un error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
*/
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import Rating from "@/modelo/Rating"; // Modelo de valoraciones
import Service from "@/modelo/Service"; // Modelo del servicio para actualizar promedio
import mongoose from "mongoose";

/*export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;*/
  export const PATCH = async (req: NextRequest, context: { params: { id: string } }) => {
    try{
        const params = await context.params;
        const id = (params.id || "").trim(); 
        
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
              { success: false, message: "ID inválido." },
              { status: 400 }
            );
          }

        await connectDB();  

        const updates = await req.json(); // Obtiene los campos a actualizar del cuerpo de la solicitud  
    
    
        if (!id || Object.keys(updates).length === 0) {
            return NextResponse.json(
                { message: "Faltan campos obligatorios o ID no proporcionado." },
                { status: 400 }
            );
        }

        // Actualizar la valoración específica
        const result = await Rating.findByIdAndUpdate(
        id,
        { $set: updates }, // Actualizar solo los campos especificados
        { new: true } // Retornar la valoración actualizada
        );

        if (!result) {
            return NextResponse.json(
                { message: "No se encontró la valoración." },
                { status: 404 }
            );
        }
        
         // Actualizar el promedio del servicio asociado
        const ratings = await Rating.find({ serviceId: result.serviceId });
        const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

        await Service.findByIdAndUpdate(
        result.serviceId,
        { averageRating },
        { new: true }
        );

        return NextResponse.json(
        { data: result, message: "Valoración actualizada correctamente." },
        { status: 200 }
        );
        
   
    } catch (error) {
        console.error("Error al actualizar la valoración:", error);
        return NextResponse.json(
        { message: "Error al actualizar la valoración." },
        { status: 500 }
        );
    }
    }

/*export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;*/
export const DELETE = async (req: NextRequest, context: {params: {id: string }}) => {
  

  try {
    const params = await context.params;
    const id = (params.id || "").trim();

    // Validar que el ID sea válido
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido." },
        { status: 400 }
      );
    }

    await connectDB();
    // Eliminar la valoración específica
    const result = await Rating.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { message: "No se encontró la valoración." },
        { status: 404 }
      );
    }

    // Actualizar el promedio del servicio asociado
    const ratings = await Rating.find({ serviceId: result.serviceId });
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    await Service.findByIdAndUpdate(
      result.serviceId,
      { averageRating },
      { new: true }
    );

    return NextResponse.json(
      { message: "Valoración eliminada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar la valoración:", error);
    return NextResponse.json(
      { message: "Error al eliminar la valoración." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json(
      { message: "ID no proporcionado." },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    // Obtener la valoración específica por su ID
    const result = await Rating.findById(id).populate("serviceId");

    if (!result) {
      return NextResponse.json(
        { message: "No se encontró la valoración." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: result, message: "Valoración obtenida correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener la valoración:", error);
    return NextResponse.json(
      { message: "Error al obtener la valoración." },
      { status: 500 }
    );
  }
}
