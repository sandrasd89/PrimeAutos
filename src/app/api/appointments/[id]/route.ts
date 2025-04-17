
/*
import { connectDB } from "@/utils/mongodb"; // Conexión a MongoDB
import Appointment from "@/modelo/Cita"; // Modelo de citas definido con Mongoose
import { NextResponse } from "next/server"; // Para manejo de respuestas

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Asegurar que params está definido antes de extraer el ID
    if (!params || !params.id) {
      return NextResponse.json({ success: false, message: "ID inválido." }, { status: 400 });
    }

    const { id } = params;

    // Parsear el cuerpo de la solicitud
    const { status } = await req.json();

    // Validar el estado recibido
    if (!status || (status !== "Confirmada" && status !== "Rechazada")) {
      return NextResponse.json(
        { success: false, message: "Estado inválido. Debe ser 'Confirmada' o 'Rechazada'." },
        { status: 400 }
      );
    }

    // Actualizar el estado de la cita
    const result = await Appointment.findByIdAndUpdate(
      id, // ID del documento
      { estado: status }, // Asegurar que es la propiedad correcta en la BD
      { new: true } // Retornar el documento actualizado
    );

    if (!result) {
      return NextResponse.json({ success: false, message: "Cita no encontrada." }, { status: 404 });
    }

    // Respuesta exitosa
    return NextResponse.json(
      { success: true, message: "Estado actualizado correctamente.", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    return NextResponse.json(
      { success: false, message: "Error del servidor. Inténtalo más tarde." },
      { status: 500 }
    );
  }
};
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import Appointment from "@/modelo/Cita";

export const PATCH = async (req: NextRequest, context: { params: { id: string } }) => {
  try {
    await connectDB();
    const { params } = context;

    if (!params || !params.id) {
      return NextResponse.json({ success: false, message: "ID no proporcionado" }, { status: 400 });
    }

    const { id } = params; // Extraer el ID correctamente
    const { status } = await req.json(); // Obtener los datos del cuerpo de la solicitud

    // Validar el estado recibido
    if (!["Confirmada", "Rechazada"].includes(status)) {
      return NextResponse.json({ success: false, message: "Estado inválido" }, { status: 400 });
    }

    // Buscar y actualizar la cita en la base de datos
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, { estado: status }, { new: true });

    if (!updatedAppointment) {
      return NextResponse.json({ success: false, message: "Cita no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedAppointment });
  } catch (error) {
    console.error("Error actualizando la cita:", error);
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 });
  }
};

import { NextRequest, NextResponse } from "next/server";
import Appointment from "@/modelo/Cita"; // Modelo definido con Mongoose
import { connectDB } from "@/utils/mongodb";

export const PATCH = async (req: NextRequest, context: { params: { id: string } }) => {
  try {
    const params = await context.params;
    //const {params} = context;
    console.log("Resolved Params: ", params);

    // Asegurarse de que params.id está disponible
    if (!params.id) {
      return NextResponse.json(
        { success: false, message: "ID inválido." },
        { status: 400 }
      );
    }

    const { id } = params; // Extraer el ID correctamente
    const { status } = await req.json(); // Obtener los datos del cuerpo de la solicitud
    console.log("Request Body:", status);

    // Validar el estado recibido
    if (!status || (status !== "Confirmada" && status !== "Rechazada")) {
      return NextResponse.json(
        { success: false, message: "Estado inválido. Debe ser 'Confirmada' o 'Rechazada'." },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await connectDB();

    // Actualizar el estado de la cita
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id, // ID del documento
      { ...req.json() }, // Actualización todos los campos del cuerpo de la solicitud
      { new: true } // Retornar el documento actualizado
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { success: false, message: "Cita no encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Estado actualizado correctamente.", data: updatedAppointment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
};

import { NextRequest, NextResponse } from "next/server";
import Appointment from "@/modelo/Appointment"; // Modelo definido con Mongoose
import { connectDB } from "@/utils/mongodb";

// PATCH: Actualizar una cita existente
export const PATCH = async (req: NextRequest, context: { params: { id: string } }) => {
  try {
    const params = await context.params;
    //const { id } = context.params;
    //console.log("Resolved Params: ", params);

    const id = (params.id || "").trim();

    // Asegurarse de que params.id está disponible
    if (!id || id.length !==24) {
      return NextResponse.json(
        { success: false, message: "ID inválido." },
        { status: 400 }
      );
    }

    //const { id } = params; // Extraer el ID correctamente
    const body = await req.json();

    //const { status } = await req.json(); // Obtener los datos del cuerpo de la solicitud
    console.log("Request Body:", body);


    // Validar el estado recibido
    if (!body || !body.name || !body.email || !body.telephone|| !body.date || !body.time || !body.status) {
      return NextResponse.json(
        { success: false, message: "Cuerpo de solicitud incompleto o inválido." },
        { status: 400 }
      );
    }
   // Validar que al menos el estado sea proporcionado
   const { status } = body;
   if (!status || !["Pendiente", "Confirmada", "Rechazada"].includes(status)) {
     return NextResponse.json(
       { success: false, message: "Estado no válido." },
       { status: 400 }
     );
   }

    // Conectar a la base de datos
    await connectDB();

    // Actualizar el estado de la cita
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { ...body }, // Actualizar solo el estado de la cita
      { new: true } // Retornar el documento actualizado
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { success: false, message: "Cita no encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Estado actualizado correctamente.", data: updatedAppointment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
};

// DELETE: Eliminar una cita existente
export const DELETE = async (req: NextRequest, context: { params: { id: string } }) => {
  try {
    const params = await context.params;
    console.log("Resolved Params for DELETE:", params);

    // Asegurarse de que params.id está disponible
    if (!params.id) {
      return NextResponse.json(
        { success: false, message: "ID inválido." },
        { status: 400 }
      );
    }

    const { id } = params;

    // Conectar a la base de datos
    await connectDB();

    // Eliminar la cita en la base de datos
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return NextResponse.json(
        { success: false, message: "Cita no encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Cita eliminada correctamente.", data: deletedAppointment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
};*/

import { NextRequest, NextResponse } from "next/server";
import Appointment from "@/modelo/Appointment"; // Modelo definido con Mongoose
import { connectDB } from "@/utils/mongodb";
import mongoose from "mongoose"; // Para validación del ID

// PATCH: Actualizar una cita existente
export const PATCH = async (req: NextRequest, context: { params: { id: string } }) => {
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

    const body = await req.json(); // Leer el cuerpo de la solicitud

    console.log("Request Body:", body);

    // Validar que el cuerpo de la solicitud tenga los campos requeridos
    //const { name, email, telephone, date, time, status } = body;

    /*if (!name || !email || !telephone || !date || !time || !status) {
      return NextResponse.json(
        { success: false, message: "Datos incompletos o inválidos." },
        { status: 400 }
      );
    }

    // Validar el estado
    if (!["Pendiente", "Confirmada", "Rechazada"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Estado no válido." },
        { status: 400 }
      );
    }*/

      // Validar que al menos un campo esté presente
    const allowedFields = ["name", "email", "telephone", "date", "time", "status"];
    const updates = Object.keys(body)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = body[key];
      return obj;
    }, {} as Record<string, any>);

    // Validar que `updates` no esté vacío
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No se han proporcionado campos válidos para actualizar." },
        { status: 400 }
      );
    }

    // Validar `status` si está presente
    if (updates.status && !["Pendiente", "Confirmada", "Rechazada"].includes(updates.status)) {
      return NextResponse.json(
        { success: false, message: "Estado no válido." },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await connectDB();

    console.log("Updates Object:", updates);

    // Actualizar la cita con los campos enviados
    //const updates = { name, email, telephone, date: new Date(body.date), time, status };

    const updatedAppointment = await Appointment.findByIdAndUpdate(id, updates, {
      new: true, // Retorna la cita actualizada
      runValidators: true, // Ejecuta las validaciones del esquema
    });

    if (!updatedAppointment) {
      return NextResponse.json(
        { success: false, message: "Cita no encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Cita actualizada correctamente.", data: updatedAppointment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
};

// DELETE: Eliminar una cita existente
export const DELETE = async (req: NextRequest, context: { params: { id: string } }) => {
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

    // Conectar a la base de datos
    await connectDB();

    // Eliminar la cita
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return NextResponse.json(
        { success: false, message: "Cita no encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Cita eliminada correctamente.", data: deletedAppointment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
};

