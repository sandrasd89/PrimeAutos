

"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

 // Traducciones dinámicas
 const t = useTranslations();

 return (
  <nav className="bg-white text-yellow-600 shadow-lg border-b border-gray-200">
    {/* Barra superior (desktop: tres columnas: logo - nav links - language) */}
    <div className="container mx-auto flex items-center justify-between py-4 px-6 relative">
      {/* Columna izquierda: Logo */}
      <div className="flex-shrink-0">
        <Link href="/" className="flex items-center no-underline hover:no-underline">
          <Image
            src="/logoTaller.png"
            alt="Prime Autos Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <span className="ml-3 text-2xl font-bold text-yellow-600">
            Prime Autos
          </span>
        </Link>
      </div>

      {/* Columna central: Enlaces de navegación (solo en desktop) */}
      <div className="hidden lg:flex flex-1 justify-center space-x-8">
        {[
          { name: t.navbar.home, href: "/" },
          { name: t.navbar.services, href: "/service" },
          { name: t.navbar.appointment, href: "/appointmentPage" },
          { name: t.navbar.aboutUs, href: "/aboutUs" },
          { name: t.navbar.contact, href: "/contact" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-lg font-medium no-underline hover:no-underline hover:text-yellow-900 transition ${
              pathname === link.href
                ? "text-yellow-900 font-semibold"
                : "text-yellow-600"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Columna derecha: LanguageSwitcher y botón de menú (en móvil) */}
      <div className="flex items-center">
        {/* LanguageSwitcher visible en desktop */}
        <div className="hidden lg:block">
          <LanguageSwitcher />
        </div>
        {/* Botón de menú para móviles */}
        <button
          className="block lg:hidden ml-4 focus:outline-none"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen ? "true" : "false"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6 text-yellow-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    </div>

    {/* Menú desplegable móvil */}
    {menuOpen && (
      <div className="lg:hidden bg-white shadow-md border-t border-gray-200 py-4 z-50">
        <ul className="flex flex-col items-center space-y-4">
          {[
            { name: t.navbar.home, href: "/" },
            { name: t.navbar.services, href: "/service" },
            { name: t.navbar.appointment, href: "/appointmentPage" },
            { name: t.navbar.aboutUs, href: "/aboutUs" },
            { name: t.navbar.contact, href: "/contact" },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-lg font-medium no-underline hover:no-underline hover:text-yellow-900 transition ${
                  pathname === link.href
                    ? "text-yellow-900 font-semibold"
                    : "text-yellow-600"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
          {/* LanguageSwitcher también para móvil */}
          <li className="mt-4">
            <LanguageSwitcher />
          </li>
        </ul>
      </div>
    )}
  </nav>
);
}

export default Navbar;