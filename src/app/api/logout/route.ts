// /app/api/logout/route.ts (o en /pages/api/logout.ts, según la estructura de tu proyecto)
import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export const POST = async (req: NextRequest) => {
  // Establecemos la cookie 'refreshToken' vacía y le asignamos un maxAge negativo para eliminarla
  const expiredCookie = serialize('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: -1, // El valor negativo indica que la cookie debe eliminarse
  });

  // Devolvemos una respuesta indicando que la sesión se ha cerrado correctamente
  return NextResponse.json(
    { success: true, message: 'Sesión cerrada exitosamente.' },
    { status: 200, headers: { 'Set-Cookie': expiredCookie } }
  );
};
