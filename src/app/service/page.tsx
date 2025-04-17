
import axios from "axios";
import ServicesClient from "./ServicesClient";

type Service = {
  _id: string;
  name: string;
  description: string;
  price: string;
  vehicleType: "Automóvil" | "Motocicleta" | "Camión";
  averageRating?: number; // Promedio de valoraciones
};

// Función para obtener los servicios dinámicamente usando Axios
async function getServices(): Promise<Service[]> {
  try {
    // Llama al endpoint usando Axios
    const response = await axios.get(`${process.env.NEXT_URL}/api/services`);
    return response.data.data; // Retorna los datos de los servicios
  } catch (error) {
    console.error("Error al obtener los servicios:", error);
    throw new Error("Error al obtener los servicios");
  }
}

export default async function ServicesPage() {
  const services = await getServices(); // Obtener los servicios desde el servidor

  return <ServicesClient services={services} />;
}

