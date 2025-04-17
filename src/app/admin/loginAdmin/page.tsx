// Login.tsx (Frontend)
/*"use client"

import { useState } from 'react';
import axios from 'axios';

const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post("/api/login", { email, password });
      
      if (response.data.success) {
        // Guardar el token en el almacenamiento local
        localStorage.setItem('token', response.data.token);
        // Redirigir al administrador a la página protegida
        window.location.href = '/admin';
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      console.error(error);
      setError('Hubo un error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Iniciar sesión como Administrador</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginAdmin;

"use client";

import { useState } from "react";
import axios from "axios";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/login", { email, password });

      if (response.data.success) {
        // Guardar el token en el almacenamiento local
        localStorage.setItem("token", response.data.token);
        // Redirigir al administrador a la página protegida
        window.location.href = "/admin";
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Hubo un error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Iniciar Sesión como Administrador
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white font-bold rounded-lg ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};

export default LoginAdmin;*//*
"use client"

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie"; // Para manejar cookies de manera segura

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

      // 🔸 Configurar Refresh Token en una cookie segura
      const refreshTokenCookie = serialize("refreshToken", refreshToken, {
        httpOnly: true, // Solo accesible por el servidor
        secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
        sameSite: "strict", // Protección CSRF
        path: "/", // Accesible en todas las rutas
        maxAge: 7 * 24 * 60 * 60, // Expira en 7 días
      });

      // 🔹 Responder con el Access Token y configurar cookie
      return new NextResponse(
        JSON.stringify({ success: true, accessToken }),
        {
          status: 200,
          headers: { "Set-Cookie": refreshTokenCookie },
        }
      );
    }

    // 🔹 Si las credenciales son incorrectas
    return NextResponse.json({ success: false, message: "Credenciales incorrectas" }, { status: 401 });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 });
  }
};*/

"use client";

import { useState } from "react";
import axios from "axios";

const LoginAdmin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/login", { email, password });

      if (response.data.success) {
        // Guardar el accessToken en localStorage
        localStorage.setItem("token", response.data.accessToken);
        // Redirigir al administrador a la página protegida
        window.location.href = "/admin";
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Hubo un problema al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Iniciar Sesión como Administrador
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white font-bold rounded-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};

export default LoginAdmin;
