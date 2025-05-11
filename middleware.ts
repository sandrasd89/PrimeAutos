// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Aplicar este middleware solo a las rutas protegidas, por ejemplo, /admin
  if (pathname.startsWith('/admin')) {
    // Se busca la cookie 'refreshToken' en la solicitud
    const token = req.cookies.get('refreshToken')?.value;

    // Si no se encuentra el token, redirige al login
    if (!token) {
      return NextResponse.redirect(new URL('/loginAdmin', req.url));
    }

    try {
      // Se utiliza la clave secreta para verificar el token
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET no está definido en el entorno");
      }
      
      // Si el token es válido, permite que la solicitud continúe
      jwt.verify(token, secret);
      return NextResponse.next();
    } catch (error) {
      console.error('Error verificando el token:', error);
      // Si el token ha expirado o no es válido, redirige al login
      return NextResponse.redirect(new URL('/loginAdmin', req.url));
    }
  }

  // Para otras rutas, continúa sin modificaciones
  return NextResponse.next();
}

// Configuramos el matcher para que el middleware se aplique únicamente a las rutas /admin/*
export const config = {
  matcher: ['/admin/:path*'],
};
