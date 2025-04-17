"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "@/components/Inputs";
import Button from "@/components/Button";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

// Tipo original de servicio (la API puede devolver name y description como string o como objeto con 'es' y 'en')
type Service = {
  _id: string;
  name: string | { es: string; en: string };
  description: string | { es: string; en: string };
  price: string;
  vehicleType: "Automóvil" | "Motocicleta" | "Camión";
  averageRating?: number;
  ratings?: { rating: number; comment: string }[];
};

// Nuevo tipo para trabajar con servicios ya localizados (con name y description como cadenas)
type LocalizedService = {
  _id: string;
  name: string;
  description: string;
  price: string;
  vehicleType: "Automóvil" | "Motocicleta" | "Camión";
  averageRating?: number;
  ratings?: { rating: number; comment: string }[];
};

interface ServicesClientProps {
  services: Service[];
}

export function ServicesClient({ services }: ServicesClientProps) {
  const t = useTranslations();
  const { locale } = useLanguage(); // Se espera "es" o "en"

  // Función auxiliar para obtener la traducción según el idioma actual
  const localize = (value: string | { es: string; en: string }): string =>
    typeof value === "object" ? value[locale as "es" | "en"] : value;

  // Textos para la interfaz obtenidos del hook de traducciones
  const titleText = localize(t.services.title);
  const filterLabelText = localize(t.services.filterLabel);
  const filterDefaultText = localize(t.services.filterDefault);
  const commentPlaceholderText = localize(t.services.commentPlaceholder);
  const commentLabelText = localize(t.services.commentLabel);
  const submitButtonText = localize(t.services.submitButton);
  const rateThisServiceText = localize(t.services.rateThisService);
  const errorMessageText = localize(t.services.errorMessage);
  const vehicleTypeLabelText = localize(t.services.vehicleTypeLabel);
  const ratingLabelText = localize(t.services.ratingLabel);
  const noRatingsText = t.services.noRatings
    ? localize(t.services.noRatings)
    : locale === "en"
    ? "No ratings"
    : "Sin valoraciones";

  // Para los textos de los tipos de vehículo (display) usamos localize
  const vehicleTypesDisplayLocalized = {
    car: localize(t.services.vehicleTypes.display.car),
    motorcycle: localize(t.services.vehicleTypes.display.motorcycle),
    truck: localize(t.services.vehicleTypes.display.truck),
  };

  // Estado para el filtro. Se usa el valor por defecto (por ejemplo, "Todos los Vehículos")
  const [filter, setFilter] = useState<string>(filterDefaultText);
  useEffect(() => {
    setFilter(filterDefaultText);
  }, [filterDefaultText]);

  // Estados para valoraciones y comentarios, identificados por serviceId
  const [rating, setRating] = useState<{ [key: string]: number }>({});
  const [comment, setComment] = useState<{ [key: string]: string }>({});

  // Convertir los servicios originales a servicios localizados (donde name y description son strings)
  const [updatedServices, setUpdatedServices] = useState<LocalizedService[]>([]);
  useEffect(() => {
    const localized: LocalizedService[] = services.map((service) => ({
      _id: service._id,
      name:
        typeof service.name === "object"
          ? service.name[locale as "es" | "en"]
          : service.name,
      description:
        typeof service.description === "object"
          ? service.description[locale as "es" | "en"]
          : service.description,
      price: service.price,
      vehicleType: service.vehicleType,
      averageRating: service.averageRating,
      ratings: service.ratings,
    }));
    setUpdatedServices(localized);
  }, [services, locale]);

  // Función para mapear el valor del filtro seleccionado al valor almacenado en la base
  const getModelFilter = (selected: string) => {
    if (selected === filterDefaultText) return selected;
    const keys = Object.keys(t.services.vehicleTypes.display) as Array<
      keyof typeof t.services.vehicleTypes.display
    >;
    const mapping = t.services.vehicleTypes.model;
    for (const key of keys) {
      if (localize(t.services.vehicleTypes.display[key]) === selected) {
        return mapping[key];
      }
    }
    return selected;
  };

  const modelFilter = getModelFilter(filter);
  const filteredServices = updatedServices.filter(
    (service) =>
      modelFilter === filterDefaultText || service.vehicleType === modelFilter
  );

  // Mapeo para mostrar el tipo de vehículo según el idioma (puedes personalizarlo)
  const vehicleTypeMapping: Record<"Automóvil" | "Motocicleta" | "Camión", string> = {
    Automóvil: locale === "en" ? "Car" : "Automóvil",
    Motocicleta: locale === "en" ? "Motorcycle" : "Motocicleta",
    Camión: locale === "en" ? "Truck" : "Camión",
  };

  // Handler para actualizar la valoración de un servicio
  const handleRating = (serviceId: string, ratingValue: number) => {
    setRating((prev) => ({ ...prev, [serviceId]: ratingValue }));
  };

  // Handler para actualizar el comentario
  const handleCommentChange = (serviceId: string, value: string) => {
    setComment((prev) => ({ ...prev, [serviceId]: value }));
  };

  // Función que envía la valoración y actualiza el servicio en tiempo real
  const handleSubmit = async (serviceId: string) => {
    if (!rating[serviceId] || rating[serviceId] < 1) {
      alert(
        locale === "en"
          ? "Please provide a rating."
          : "Por favor, ingresa una valoración."
      );
      return;
    }
    try {
      const payload = {
        serviceId,
        rating: rating[serviceId],
        comment: comment[serviceId] || "",
      };
      const response = await axios.post("/api/ratings", payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.success) {
        alert(
          locale === "en"
            ? "Thank you for your rating!"
            : "¡Gracias por tu valoración!"
        );
        setRating((prev) => ({ ...prev, [serviceId]: 0 }));
        setComment((prev) => ({ ...prev, [serviceId]: "" }));

        // Actualizar el servicio con los nuevos datos en tiempo real
        const updatedServiceResponse = await axios.get(`/api/services/${serviceId}`);
        const updatedServiceIndex = updatedServices.findIndex((s) => s._id === serviceId);
        if (updatedServiceIndex !== -1) {
          const newServices = [...updatedServices];
          newServices[updatedServiceIndex] = {
            ...newServices[updatedServiceIndex],
            averageRating: updatedServiceResponse.data.data.averageRating,
            ratings: updatedServiceResponse.data.data.ratings,
          };
          setUpdatedServices(newServices);
        }
      } else {
        alert(
          response.data.message ||
            (locale === "en"
              ? "Error submitting your rating."
              : "Error al enviar la valoración.")
        );
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert(
        locale === "en"
          ? "Error submitting your rating."
          : "Error al enviar la valoración. Intenta nuevamente."
      );
    }
  };

  return (
    <main className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">{titleText}</h1>
      {/* Filtro de Servicios */}
      <div className="flex justify-center mb-8">
        <label className="mr-2 font-semibold">{filterLabelText}:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
        >
          <option value={filterDefaultText}>{filterDefaultText}</option>
          <option value={vehicleTypesDisplayLocalized.car}>
            {vehicleTypesDisplayLocalized.car}
          </option>
          <option value={vehicleTypesDisplayLocalized.motorcycle}>
            {vehicleTypesDisplayLocalized.motorcycle}
          </option>
          <option value={vehicleTypesDisplayLocalized.truck}>
            {vehicleTypesDisplayLocalized.truck}
          </option>
        </select>
      </div>
      {/* Lista de Servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service._id}
            className="p-6 border border-gray-300 rounded-lg shadow-md bg-white"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{service.name}</h2>
            <p className="text-gray-700 mb-4">{service.description}</p>
            <p className="text-yellow-600 font-bold text-lg mb-4">{service.price}</p>
            <p className="text-sm text-gray-500 italic">
              {vehicleTypeLabelText}: {vehicleTypeMapping[service.vehicleType]}
            </p>
            <p className="text-sm text-gray-500 italic">
              {ratingLabelText}{" "}
              {typeof service.averageRating === "number" && service.averageRating > 0
                ? `${service.averageRating.toFixed(1)} ★`
                : noRatingsText}
            </p>
            {/* Sistema de Valoración */}
            <div className="mt-4">
              <p className="font-semibold">{rateThisServiceText}</p>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    buttonLabel="★"
                    buttonType={star <= (rating[service._id] || 0) ? "dark" : "light"}
                    onButtonClick={() => handleRating(service._id, star)}
                  />
                ))}
              </div>
              <Input
                type="textarea"
                name={`comment-${service._id}`}
                value={comment[service._id] || ""}
                onChange={(e) => handleCommentChange(service._id, e.target.value)}
                placeholder={commentPlaceholderText}
                label={commentLabelText}
                className="w-full mt-2"
              />
              <Button
                buttonLabel={submitButtonText}
                buttonType="dark"
                onButtonClick={() => handleSubmit(service._id)}
                className="mt-2"
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default ServicesClient;
