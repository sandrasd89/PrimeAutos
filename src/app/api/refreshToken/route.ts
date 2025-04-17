
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "clave_secreta";

export const POST = async (req: NextRequest) => {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      console.error("No se proporcionó el Refresh Token");
      return NextResponse.json({ success: false, message: "No hay Refresh Token" }, { status: 401 });
    }

    const decoded = jwt.verify(refreshToken, secret) as { email: string; role: string };

    const newAccessToken = jwt.sign({ email: decoded.email, role: decoded.role }, secret, { expiresIn: "1h" });

    return NextResponse.json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    // Type Guard para garantizar que error tiene la propiedad name
    if (error instanceof jwt.JsonWebTokenError) {
      if (error.name === "TokenExpiredError") {
        console.error("Refresh Token expirado");
        return NextResponse.json({ success: false, message: "Token expirado" }, { status: 403 });
      }
      if (error.name === "JsonWebTokenError") {
        console.error("Refresh Token mal formado");
        return NextResponse.json({ success: false, message: "Token inválido o mal formado" }, { status: 403 });
      }
    }

    console.error("Error inesperado:", error);
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 });
  }
};
