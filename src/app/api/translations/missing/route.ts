// app/api/translations/missing/route.ts
/*import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { findMissingKeys } from '@/utils/compareTranslations';

export async function GET(req: NextRequest) {
  // Establece el idioma base y el target (en este ejemplo, español)
  const baseLang = 'en';
  const targetLang = req.nextUrl.searchParams.get('lang') === 'en' ? 'en' : 'es';

  // Construye las rutas absolutas a los archivos JSON
  const basePath = path.join(process.cwd(), 'src', 'locales', `${baseLang}.json`);
  const targetPath = path.join(process.cwd(), 'src', 'locales', `${targetLang}.json`);

  try {
    const baseData = JSON.parse(fs.readFileSync(basePath, 'utf8'));
    const targetData = fs.existsSync(targetPath)
      ? JSON.parse(fs.readFileSync(targetPath, 'utf8'))
      : {};

    const missing = findMissingKeys(baseData, targetData);
    return NextResponse.json({ missing });
  } catch (error) {
    return NextResponse.json(
      { missing: { error: 'Error al leer los archivos de traducción' } },
      { status: 500 }
    );
  }
}*/

// app/api/translations/missing/route.ts
import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { findMissingKeys } from "@/utils/compareTranslations";

export async function GET(req: NextRequest) {
  const baseLang = "en";
  const targetLang = req.nextUrl.searchParams.get("lang") === "en" ? "en" : "es";

  const basePath = path.join(process.cwd(), "src", "locales", `${baseLang}.json`);
  const targetPath = path.join(process.cwd(), "src", "locales", `${targetLang}.json`);

  try {
    const baseData = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const targetData = fs.existsSync(targetPath) ? JSON.parse(fs.readFileSync(targetPath, "utf8")) : {};

    const missing = findMissingKeys(baseData, targetData);
    return NextResponse.json({ missing });
  } catch (error) {
    return NextResponse.json(
      { missing: { error: "Error al leer los archivos de traducción" } },
      { status: 500 }
    );
  }
}

