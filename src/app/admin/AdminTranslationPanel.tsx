"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Input from "@/components/Inputs";
import Button from "@/components/Button";

export default function AdminTranslationsPanel() {
  const [missingKeys, setMissingKeys] = useState<{
    completamente_faltantes: any;
    parcialmente_traducidas: any;
  }>({
    completamente_faltantes: {},
    parcialmente_traducidas: {}
  });
  
  const [updates, setUpdates] = useState<Record<string, { es?: string; en?: string }>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Obtener claves faltantes y parcialmente traducidas
  const fetchMissingKeys = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/translations/missing");
      setMissingKeys(res.data.missing);
    } catch (error) {
      console.error("Error al obtener las claves faltantes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissingKeys();
  }, []);

  // Manejo de cambios en los inputs de traducción
  const handleInputChange = (key: string, lang: "es" | "en", value: string) => {
    setUpdates((prev) => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value }
    }));
  };

  // Guardar traducciones actualizadas en una única solicitud
  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/translations/update", updates);
      
      if (res.data.success) {
        setMessage("Traducciones actualizadas correctamente.");
        fetchMissingKeys(); // Recargar las claves faltantes para actualizar la interfaz
        setUpdates({}); // Limpiar el estado de actualizaciones
      } else {
        setMessage("Ocurrió un error al actualizar las traducciones.");
      }
    } catch (error) {
      console.error("Error guardando las traducciones", error);
      setMessage("Error al guardar las traducciones.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Panel de Traducciones Multilingüe</h1>
      
      {loading && <p>Cargando...</p>}
      {!loading && (
        <>
          {/* Claves completamente faltantes */}
          <h2 className="text-xl font-bold mt-6 mb-2">🔴 Claves completamente faltantes</h2>
          {Object.keys(missingKeys.completamente_faltantes).length === 0 ? (
            <p>No hay claves completamente faltantes.</p>
          ) : (
            Object.keys(missingKeys.completamente_faltantes).map((key) => (
              <div key={key} className="mb-4">
                <label className="block font-bold mb-1">{key}</label>
                <Input
                  type="text"
                  name={`${key}_es`}
                  value={updates[key]?.es || ""}
                  onChange={(e) => handleInputChange(key, "es", e.target.value)}
                  placeholder="Traducción en español"
                  label="ES"
                  className="w-full"
                />
                <Input
                  type="text"
                  name={`${key}_en`}
                  value={updates[key]?.en || ""}
                  onChange={(e) => handleInputChange(key, "en", e.target.value)}
                  placeholder="Translation in English"
                  label="EN"
                  className="w-full"
                />
              </div>
            ))
          )}

          {/* Claves parcialmente traducidas */}
          <h2 className="text-xl font-bold mt-6 mb-2">🟡 Claves parcialmente traducidas</h2>
          {Object.keys(missingKeys.parcialmente_traducidas).length === 0 ? (
            <p>No hay claves parcialmente traducidas.</p>
          ) : (
            Object.keys(missingKeys.parcialmente_traducidas).map((key) => (
              <div key={key} className="mb-4">
                <label className="block font-bold mb-1">{key}</label>
                <Input
                  type="text"
                  name={`${key}_es`}
                  value={updates[key]?.es || missingKeys.parcialmente_traducidas[key].es || ""}
                  onChange={(e) => handleInputChange(key, "es", e.target.value)}
                  placeholder="Completar traducción en español"
                  label="ES"
                  className="w-full"
                />
                <Input
                  type="text"
                  name={`${key}_en`}
                  value={updates[key]?.en || missingKeys.parcialmente_traducidas[key].en || ""}
                  onChange={(e) => handleInputChange(key, "en", e.target.value)}
                  placeholder="Complete translation in English"
                  label="EN"
                  className="w-full"
                />
              </div>
            ))
          )}

          <Button
            buttonLabel="Guardar Traducciones"
            onButtonClick={handleSave}
            buttonType="dark"
            className="mt-4"
            disabled={loading}
          />

          {message && <p className="mt-2 text-green-600">{message}</p>}
        </>
      )}
    </div>
  );
}
