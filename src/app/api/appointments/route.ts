/*import { connectDB } from "@/utils/mongodb"; // Conexión a MongoDB
import Appointment from "@/modelo/Cita"; // Modelo de citas definido con Mongoose
import { NextResponse } from "next/server"; // Manejo de respuestas en App Router

// Obtener citas disponibles (GET)
export const GET = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Buscar todas las citas
    const citas = await Appointment.find(); // Recupera todas las citas
    return NextResponse.json({ success: true, data: citas }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return NextResponse.json({ success: false, message: "Error obteniendo citas" }, { status: 500 });
  }
};

// Agendar nueva cita (POST)
export const POST = async (req: Request) => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener los datos del cuerpo de la solicitud
    const { nombre, email, telefono, fecha, hora } = await req.json();

    // Validar los datos proporcionados
    if (!nombre || !email || !telefono || !fecha || !hora) {
      return NextResponse.json({ success: false, message: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // Validar que la fecha proporcionada es válida
    const fechaValida = new Date(fecha);
    if (isNaN(fechaValida.getTime())) {
      return NextResponse.json({ success: false, message: "La fecha proporcionada no es válida" }, { status: 400 });
    }

    // Crear y guardar la nueva cita
    const nuevaCita = new Appointment({
      nombre,
      email,
      telefono,
      fecha: fechaValida,
      hora,
      estado: "Pendiente",
    });

    //await nuevaCita.save();
    const savedCita = await nuevaCita.save();

    // Responder con éxito
    return NextResponse.json({ success: true, data: savedCita, message: "Cita agendada con éxito" }, { status: 201 });
  } catch (error) {
    console.error("Error al guardar la cita:", error);
    return NextResponse.json({ success: false, message: "Error agendando la cita" }, { status: 500 });
  }
};
*/

import { connectDB } from "@/utils/mongodb"; // Conexión a MongoDB
import Appointment from "@/modelo/Appointment"; // Modelo de citas definido con Mongoose
import { NextResponse } from "next/server"; // Manejo de respuestas en App Router
import sendEmail from "../emailService/route";

// Obtener citas disponibles o por fecha específica (GET)
export const GET = async (req: Request) => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Parsear los parámetros de la URL
    const { searchParams } = new URL(req.url!);
    const date = searchParams.get("date"); // Obtener el parámetro "date" si está presente

    if (date) {
      // Si se proporciona una fecha, buscar las citas para esa fecha
      const appointmentsByDate = await Appointment.find({ date });
      return NextResponse.json({ success: true, data: appointmentsByDate }, { status: 200 });
    }

    // Si no se proporciona una fecha, devolver todas las citas
    const allAppointments = await Appointment.find();
    return NextResponse.json({ success: true, data: allAppointments }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return NextResponse.json({ success: false, message: "Error obteniendo citas" }, { status: 500 });
  }
};

// Agendar nueva cita (POST)
export const POST = async (req: Request) => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Lee el cuerpo de la solicitud y almacénalo para su uso posterior
    const bodyText = await req.text();
    console.log("Cuerpo recibido como texto:", bodyText);

    const body = JSON.parse(bodyText);
    // Obtener los datos del cuerpo de la solicitud
    const { name, email, telephone, date, time, status } = body;
    console.log("Datos después de procesar JSON:", { name, email, telephone, date, time, status });

    // Validar los datos proporcionados
    if (!name || !email || !telephone || !date || !time || !status) {
      return NextResponse.json({ success: false, message: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // Validar que la fecha proporcionada es válida
    const validDate = new Date(date);
    if (isNaN(validDate.getTime())) {
      return NextResponse.json({ success: false, message: "La fecha proporcionada no es válida" }, { status: 400 });
    }

    // Verificar si la hora ya está ocupada para esa fecha
    const existingAppointment = await Appointment.findOne({ date, time });
    if (existingAppointment) {
      return NextResponse.json(
        { success: false, message: "La hora seleccionada ya está ocupada para esta fecha" },
        { status: 400 }
      );
    }

    // Crear y guardar la nueva cita
    const newAppointment = new Appointment({
      name,
      email,
      telephone,
      date: validDate,
      time,
      status: "Pendiente",
    });

    const savedCita = await newAppointment.save();
    
    await sendEmail(
      email,
      "Confirmación de Cita",
      `Hola ${name}, tu cita ha sido agendada para el día ${date} a las ${time}.`
    );

    // Responder con éxito
    return NextResponse.json({ success: true, data: savedCita, message: "Cita agendada con éxito" }, { status: 201 });
  } catch (error) {
    console.error("Error al guardar la cita:", error);
    return NextResponse.json({ success: false, message: "Error agendando la cita" }, { status: 500 });
  }
};
