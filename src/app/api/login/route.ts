/*import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie"; // Para manejar cookies en Next.js

interface User {
  email: string;
  role: string;
}

// 🔹 Generar Access Token (Expira en 1 hora)
const generateAccessToken = (user: User) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET no definido");
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// 🔹 Generar Refresh Token (Expira en 7 días)
const generateRefreshToken = (user: User) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET no definido");
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 🔹 Manejo del login
export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();

    // 🔸 Validación de credenciales (simulada)
    if (email === "admin@gmail.com" && password === "adminpassword") {
      const user = { email, role: "admin" };
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Guardar Refresh Token en cookie segura
      const refreshTokenCookie = serialize("refreshToken", refreshToken, {
        httpOnly: true, // 🔹 Evita acceso desde JavaScript
        secure: true ,//process.env.NODE_ENV === "production",  Solo en HTTPS en producción
        sameSite: "strict", // Protección CSRF
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 🔹 Expira en 7 días
      });

      return new NextResponse(
        JSON.stringify({ success: true, accessToken }),
        {
          status: 200,
          headers: { "Set-Cookie": refreshTokenCookie },
        }
      );
    }

    return NextResponse.json({ success: false, message: "Credenciales incorrectas" }, { status: 401 });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 });
  }
};*/


import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie"; // Manejo seguro de cookies

interface User {
  email: string;
  role: string;
}

// 🔹 Generar Access Token (Expira en 1 hora)
const generateAccessToken = (user: User): string => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET no definido");
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// 🔹 Generar Refresh Token (Expira en 7 días)
const generateRefreshToken = (user: User): string => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET no definido");
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 🔹 Endpoint para manejo del login
export const POST = async (req: NextRequest) => {
  try {
    // 🔸 Obtener email y password desde el cuerpo de la solicitud
    const { email, password } = await req.json();

    // 🔸 Validación de credenciales simulada
    if (email === "admin@gmail.com" && password === "adminpassword") {
      // Configurar datos del usuario
      const user: User = { email, role: "admin" };

      // Generar Access Token y Refresh Token
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Configurar Refresh Token como cookie segura
      const refreshTokenCookie = serialize("refreshToken", refreshToken, {
        httpOnly: true, // Solo accesible desde el servidor
        secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
        sameSite: "strict", // Protección CSRF
        path: "/", // Accesible en todas las rutas del dominio
        maxAge: 7 * 24 * 60 * 60, // 7 días de duración
      });

      // Responder con el Access Token y la cookie Refresh Token
      return new NextResponse(
        JSON.stringify({ success: true, accessToken }),
        {
          status: 200,
          headers: { "Set-Cookie": refreshTokenCookie },
        }
      );
    }

    // 🔹 Respuesta para credenciales incorrectas
    return NextResponse.json(
      { success: false, message: "Credenciales incorrectas" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error en login:", error);

    // Manejo de errores
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
};
