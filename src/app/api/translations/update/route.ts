import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs';//para leer archivos
import path from 'path';//para escribir archivos

type Data = {
  success: boolean;
  message?: string;
};

function updateTranslations(target: any, updates: any): any {
  // Función recursiva para incorporar los updates en el objeto target
  for (const key in updates) {
    if (
      typeof updates[key] === 'object' &&
      updates[key] !== null &&
      !Array.isArray(updates[key])
    ) {
      target[key] = target[key] || {};
      updateTranslations(target[key], updates[key]);
    } else {
      target[key] = updates[key];
    }
  }
  return target;
}

export async function POST(req: NextRequest) {
  try {
    // Obtener el parámetro lang desde la URL
    const langParam = req.nextUrl.searchParams.get('lang');//obtenemos "lang" a través de aqui para determinar el idioma
    const targetLang = langParam === 'es' ? 'es' : 'en';
    const targetPath = path.join(process.cwd(), 'src', 'locales', `${targetLang}.json`);

    // Obtener el cuerpo de la petición (se espera un objeto JSON)
    const updates = await req.json();

    const targetData = fs.existsSync(targetPath)
      ? JSON.parse(fs.readFileSync(targetPath, 'utf8'))
      : {};

    const updatedTranslations = updateTranslations(targetData, updates);//se actualiza el objeto con los nuevos datos

    fs.writeFileSync(targetPath, JSON.stringify(updatedTranslations, null, 2), 'utf8');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error al actualizar las traducciones' },
      { status: 500 }
    );
  }
}
