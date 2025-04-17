
/*import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const GET = async (req: Request) => {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ success: false, message: "Token no proporcionado" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET as string;
    if (!secret) {
      console.error("Error: JWT_SECRET no está definido en el entorno");
      return NextResponse.json(
        { success: false, message: "Error interno del servidor" },
        { status: 500 }
      );
    }

    // Verifica el token usando la clave secreta
    const decoded = jwt.verify(token, secret);

    return NextResponse.json({ success: true, decoded });
  } catch (error) {
    console.error("Error al verificar token:", error);
    return NextResponse.json(
      { success: false, message: "Token inválido o expirado" },
      { status: 401 }
    );
  }
};

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (req: Request) => {
  try {
    // Obtener token del encabezado `Authorization`
    const authorization = req.headers.get("Authorization");
    if (!authorization) {
      return NextResponse.json(
        { success: false, message: "Token no proporcionado" },
        { status: 401 }
      );
    }

    const token = authorization.replace("Bearer ", "").trim();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token inválido o mal formado" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET as string;
    if (!secret) {
      console.error("Error: JWT_SECRET no está definido en el entorno");
      return NextResponse.json(
        { success: false, message: "Error interno del servidor" },
        { status: 500 }
      );
    }

    try {
      // Verifica el token con la clave secreta
      const decoded = jwt.verify(token, secret);
      return NextResponse.json({ success: true, decoded });
    } catch (error) {
      console.error("Error al verificar token:", error);
      return NextResponse.json(
        { success: false, message: "Token inválido o expirado" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
};*/

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (req: Request) => {
  try {
    const authorization = req.headers.get("Authorization");
    console.log("Authorization Header:", authorization); // Debug

    if (!authorization) {
      return NextResponse.json(
        { success: false, message: "Token no proporcionado" },
        { status: 401 }
      );
    }

    const token = authorization.replace("Bearer ", "").trim();
    console.log("Token recibido:", token); // Debug

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token inválido o mal formado" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET as string;
    if (!secret) {
      console.error("Error: JWT_SECRET no está definido en el entorno");
      return NextResponse.json(
        { success: false, message: "Error interno del servidor" },
        { status: 500 }
      );
    }

    try {
      const decoded = jwt.verify(token, secret);
      console.log("Token decodificado:", decoded); // Debug
      return NextResponse.json({ success: true, decoded });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error al verificar token:", error.message);
            return NextResponse.json(
              { success: false, message: error.message },
              { status: 401 }
            );
          } else {
            console.error("Error desconocido:", error);
            return NextResponse.json(
              { success: false, message: "Error desconocido" },
              { status: 500 }
            );
          }
        }
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
};
