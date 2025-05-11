
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "use-debounce";
import Input from "@/components/Inputs";
import Button from "@/components/Button";
import AdminTranslationsPanel from "./AdminTranslationPanel";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";
import { useRouter } from "next/navigation";


interface Appointment {
  _id?: string;
  name: string;
  email: string;
  telephone: string;
  date: string;
  time: string;
  status: "Pendiente" | "Confirmada" | "Rechazada";
}

interface Service {
  _id?: string;
  name: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  price: string;
  vehicleType: "Automóvil" | "Motocicleta" | "Camión";
  featured: boolean;
}

interface Testimonial {
  _id?: string;
  name: string;
  comment: { es: string; en: string };
}

export default function AdminPage() {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentTab, setCurrentTab] = useState<"appointments" | "services" | "testimonials" | "translations">("appointments");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //const [activeTab, setActiveTab] = useState("testimonios");


  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300); // Retrasa 300ms
  const { locale } = useLanguage();
  const t = useTranslations();
  const router = useRouter();

  // Definición de las opciones para el select de tipo de vehículo:
const vehicleTypeOptions = [
  { value: "Automóvil", label: locale === "en" ? "Car" : "Automóvil" },
  { value: "Motocicleta", label: locale === "en" ? "Motorcycle" : "Motocicleta" },
  { value: "Camión", label: locale === "en" ? "Truck" : "Camión" },
];


  const [appointmentForm, setAppointmentForm] = useState<Appointment>({
    name: "",
    email: "",
    telephone: "",
    date: "",
    time: "",
    status: "Pendiente",
  });

  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const [serviceForm, setServiceForm] = useState<Service>({
    name: { es: "", en: "" },
    description: { es: "", en: "" },
    price: "",
    vehicleType: "Automóvil",
    featured: false,
  
  });

  const [editingService, setEditingService] = useState<Service | null>(null);

  const [testimonialForm, setTestimonialForm] = useState<Testimonial>({ 
    name: "", 
    comment: { es: "", en: "" } 
  });

  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Función de logout: realiza la llamada al endpoint, limpia el token y redirige
  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/logout"); // Llama al endpoint de logout
      if (response.status === 200) {
        localStorage.removeItem("token"); // Limpia el token si se guardó en localStorage
        router.push("/admin/loginAdmin"); // Redirige a la página de login
      } else {
        console.error("Error al cerrar la sesión");
      }
    } catch (error) {
      console.error("Error al cerrar la sesión:", error);
    }
  };

  
  useEffect(() => {

    const token = localStorage.getItem("token");
    //setIsAuthenticated(!!token);
    /*useEffect(() => {
    // Se verifica el token en localStorage (u otra lógica de autenticación)
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirige al login si no hay token
      router.push("/admin/loginAdmin");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }*/

    // Cargar citas y servicios al inicio
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/api/appointments");
        setAppointments(response.data.data);
      } catch (err) {
        setError("Error al cargar las citas.");
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get("/api/services");
        setServices(response.data.data);
      } catch (err) {
        setError("Error al cargar los servicios.");
      }
    };

    const fetchTestimonials = async () => {
      try {
        const response = await axios.get("/api/testimonials");
        setTestimonials(response.data.data);
      } catch (err) {
        setError("Error al cargar los testimonios.");
      }
    };

    fetchAppointments();
    fetchServices();
    fetchTestimonials();
  }, []);
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      appointment.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      appointment.telephone.includes(debouncedSearchTerm)
  );


 // Filtramos los servicios usando la versión en español para simplificar (se puede ajustar a la preferencia actual)
 const filteredServices = services.filter(
  (service) =>
    service.name.es.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    service.description.es.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    service.price.includes(debouncedSearchTerm)
);
  

  // Se filtran los servicios en base a la versión en español (para simplificar).
  /*const filteredServices = services.filter((service) => {
    const nameEs =
      typeof service.name === "object" ? service.name.es : service.name;
    const descriptionEs =
      typeof service.description === "object"
        ? service.description.es
        : service.description;
    return (
      nameEs.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      descriptionEs.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      service.price.includes(debouncedSearchTerm)
    );
  });*/

  const filteredTestimonials = testimonials.filter(
    (testimonial) =>
      testimonial.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      testimonial.comment.es.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      testimonial.comment.en.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reinicia el estado de error
    try {
      const endpoint = editingAppointment ? `/api/appointments/${editingAppointment._id}` : "/api/appointments";
      const method = editingAppointment ? "PATCH" : "POST";

      const response = await axios({
        method,
        url: endpoint,
        data: appointmentForm,
      });

      if (editingAppointment) {
        setAppointments(
          appointments.map((appointment) =>
            appointment._id === editingAppointment._id ? response.data.data : appointment
          )
        );
        setEditingAppointment(null);
      } else {
        setAppointments([...appointments, response.data.data]);
      }

      setAppointmentForm({ 
        name: "",
        email: "",
        telephone: "",
        date: "",
        time: "",
        status: "Pendiente",
      });
    } catch (err) {
      setError("Error al procesar la cita.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAppointment = async (id: string) => {
    try {
      const response = await axios.patch(`/api/appointments/${id}`, {
        status: "Confirmada", // Actualiza el estado a "Confirmada"
      });
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id ? { ...appointment, status: response.data.data.status } : appointment
        )
      ); // Actualiza el estado local de citas
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error al confirmar la cita:", err.message);
      } else {
        console.error("Error desconocido:", err);
      }
      setError("Error al confirmar la cita.");
    }
  };
  

  const handleDeleteAppointment = async (id: string) => {
    try {
      await axios.delete(`/api/appointments/${id}`);
      setAppointments(appointments.filter((a) => a._id !== id));
    } catch (err) {
      setError("Error al eliminar la cita.");
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setAppointmentForm({
      name: appointment.name || "",
      email: appointment.email || "",
      telephone: appointment.telephone || "",
      date: appointment.date ? appointment.date.split("T")[0] : "", // Formatear fecha si es necesario
      time: appointment.time || "",
      status: appointment.status || "Pendiente",
    });
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reinicia el estado de error
    try {
      const endpoint = editingService ? `/api/services/${editingService._id}` : "/api/services";
      const method = editingService ? "PATCH" : "POST";

      const response = await axios({
        method,
        url: endpoint,
        data: serviceForm,
      });

      if (editingService) {
        setServices(
          services.map((service) =>
            service._id === editingService._id ? response.data.data : service
          )
        );
        setEditingService(null); // Finalizar la edición
      } else {
        setServices([...services, response.data.data]);
      }

      setServiceForm({
         name: { es: "", en: "" }, 
         description: { es: "", en: "" }, 
         price: "", 
         vehicleType: "Automóvil", 
         featured: false, 
        });
    } catch (err) {
      setError("Error al procesar el servicio.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    setError(null); // Reinicia el estado de error
    try {
      await axios.delete(`/api/services/${id}`);
      setServices(services.filter((service) => service._id !== id));
    } catch (err) {
      setError("Error al eliminar el servicio.");
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm(service);
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      await axios.patch(`/api/services/${id}`, { featured: !isFeatured });
      setServices(
        services.map((service) =>
          service._id === id ? { ...service, featured: !isFeatured } : service
        )
      );
    } catch (err) {
      setError("Error al cambiar el estado del servicio destacado.");
    }
  };
  

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const endpoint = editingTestimonial
        ? `/api/testimonials/${editingTestimonial._id}`
        : "/api/testimonials";
      const method = editingTestimonial ? "PATCH" : "POST";

      const response = await axios({
        method,
        url: endpoint,
        data: testimonialForm,
      });

      if (editingTestimonial) {
        setTestimonials(
          testimonials.map((testimonial) =>
            testimonial._id === editingTestimonial._id ? response.data.data : testimonial
          )
        );
        setEditingTestimonial(null);
      } else {
        setTestimonials([...testimonials, response.data.data]);
      }

      setTestimonialForm({ name: "", comment: { es: "", en: "" } });
    } catch (err) {
      setError("Error al procesar el testimonio.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await axios.delete(`/api/testimonials/${id}`);
      setTestimonials(testimonials.filter((testimonial) => testimonial._id !== id));
    } catch (err) {
      setError("Error al eliminar el testimonio.");
    }
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm(testimonial);
  };

 


  return (
    <div className="flex max-7xl mx-auto bg-white transition-all ">
      {/* Panel Lateral (Aside) */}
      <aside className="w-1/5 bg-gray-200 p-4 h-screen">
        <h2 className="text-lg font-bold mb-4">Panel de Administración</h2>
        <ul className="space-y-4">
          <li>
            <Button
              buttonLabel="Gestionar Citas"
              onButtonClick={() => setCurrentTab("appointments")}
              buttonType="light"
              className={`w-full text-left px-4 py-2 rounded ${
                currentTab === "appointments"
                  ? "bg-gray-800 text-yellow-500" // Activo: Gris oscuro con texto amarillo
                  : "bg-yellow-500 text-gray-800 hover:bg-gray-700 hover:text-gray-900" // Inactivo: Amarillo con texto gris oscuro
              }`}
            />
          </li>
          <li>
            <Button
              buttonLabel="Gestionar Servicios"
              onButtonClick={() => setCurrentTab("services")}
              buttonType="light"
              className={`w-full text-left px-4 py-2 rounded ${
                currentTab === "services"
                  ? "bg-gray-800 text-yellow-500" // Activo: Gris oscuro con texto amarillo
                  : "bg-yellow-500 text-gray-800 hover:bg-gray-400 hover:text-gray-900" // Inactivo: Amarillo con texto gris oscuro
              }`}
            />
          </li>
          <li>
            <Button
              buttonLabel="Gestionar Testimonios"
              onButtonClick={() => setCurrentTab("testimonials")}
              buttonType="light"
              className={`w-full text-left px-4 py-2 rounded ${
                currentTab === "testimonials"
                  ? "bg-gray-800 text-yellow-500" // Activo: Gris oscuro con texto amarillo
                  : "bg-yellow-500 text-gray-800 hover:bg-gray-700 hover:text-gray-900" // Inactivo: Amarillo con texto gris oscuro
              }`}
            />
          </li>
          <li>
            <Button
                buttonLabel="Gestionar Traducciones"
                onButtonClick={() => setCurrentTab("translations")}
                buttonType="light"
                className={`w-full text-left px-4 py-2 rounded ${
                  currentTab === "translations"
                    ? "bg-gray-800 text-yellow-500"
                    : "bg-yellow-500 text-gray-800 hover:bg-gray-700 hover:text-gray-900"
                }`}
              />
          </li>
          <li>
            <Button
              buttonLabel="Cerrar Sesión"
              onButtonClick={handleLogout}
              buttonType="light"
              className="w-full text-left px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            />
          </li>
        </ul>
      </aside>

  
      {/* Contenido Principal */}
      <main className="w-3/4 p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Panel de Administración</h1>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <Input
          type="text"
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar..."
          label=""
          required={false}
          className="block w-full px-4 py-2 rounded mb-4"
        />
  
        {currentTab === "appointments" && (
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Citas</h2>
            <form onSubmit={handleAppointmentSubmit} className="space-y-4 mb-6">
              <Input
                type="text"
                name="nombre"
                value={appointmentForm.name}
                onChange={(e) =>
                  setAppointmentForm({ ...appointmentForm, name: e.target.value })
                }
                placeholder="Nombre"
                label="Nombre"
                required
                className="w-full"
              />
              <Input
                type="email"
                name="email"
                value={appointmentForm.email}
                onChange={(e) =>
                  setAppointmentForm({ ...appointmentForm, email: e.target.value })
                }
                placeholder="Correo Electrónico"
                label="Correo Electrónico"
                required
                className="w-full"
              />
              <Input
                type="text"
                name="telefono"
                value={appointmentForm.telephone}
                onChange={(e) =>
                  setAppointmentForm({ ...appointmentForm, telephone: e.target.value })
                }
                placeholder="Teléfono"
                label="Teléfono"
                required
                className="w-full"
              />
              <Input
                type="date"
                name="fecha"
                value={appointmentForm.date}
                onChange={(e) =>
                  setAppointmentForm({ ...appointmentForm, date: e.target.value })
                }
                label="Fecha"
                required
                className="w-full"
              />
              <Input
                type="select"
                name="time"
                value={appointmentForm.time}
                onChange={(e) =>
                  setAppointmentForm({ ...appointmentForm, time: e.target.value })
                }
                options={[
                  { value: "", label: "Selecciona una hora" },
                  { value: "10:00", label: "10:00" },
                  { value: "11:00", label: "11:00" },
                  { value: "12:00", label: "12:00" },
                  { value: "14:00", label: "14:00" },
                  { value: "15:00", label: "15:00" },
                  { value: "16:00", label: "16:00" },
                  { value: "17:00", label: "17:00" },
                ]}
                label="Hora"
                required
                className="w-full"
              />
              <Input
                type="select"
                name="status"
                value={appointmentForm.status}
                onChange={(e) =>
                  setAppointmentForm({
                    ...appointmentForm,
                    status: e.target.value as "Pendiente" | "Confirmada" | "Rechazada",
                  })
                }
                options={[
                  { value: "Pendiente", label: "Pendiente" },
                  { value: "Confirmada", label: "Confirmada" },
                  { value: "Rechazada", label: "Rechazada" },
                ]}
                label="Estado"
                required
                className="w-full"
              />
              <Button
                buttonLabel={loading ? "Procesando..." : "Agregar Cita"}
                buttonType="light"
                buttonHtmlType="submit"
                className="w-full"
                disabled={loading}
              />
            </form>
            <ul className="space-y-4">
              {filteredAppointments.map((a) => (
                <li
                  key={a._id}
                  className="flex justify-between items-center p-4 border rounded-md shadow-sm"
                >
                  <div>
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-sm text-gray-500">{a.email}</p>
                    <p className="text-sm text-gray-500">{a.telephone}</p>
                    <p className="text-sm text-gray-500">{a.date}</p>
                    <p className="text-sm text-gray-500">{a.time}</p>
                    <p className="text-sm text-gray-500">{a.status}</p>
                  </div>
                  <div className="flex space-x-2">
                    {a.status === "Pendiente" && (
                      <Button
                        buttonLabel="Confirmar"
                        onButtonClick={() => {
                          console.log("Cita ID:", a._id);
                          handleConfirmAppointment(a._id!);
                        }}
                        buttonType="dark"
                        className="px-4 py-2 m-1 mb-6.5 pt-2.5 pb-2 pl-3.5 pr-3 rounded"
                      />
                    )}
                    <Button
                      buttonLabel="Editar"
                      onButtonClick={() => handleEditAppointment(a)}
                      buttonType="dark"
                      className="px-4 py-2 m-1 mb-6.5 pt-2.5 pb-2 pl-3.5 pr-3 rounded"
                    />
                    <Button
                      buttonLabel="Eliminar"
                      onButtonClick={() => handleDeleteAppointment(a._id!)}
                      buttonType="dark"
                      className="px-4 py-2 m-1 mb-6.5 pt-2.5 pb-2 pl-3.5 pr-3 rounded"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
  
        {currentTab === "testimonials" && (
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Testimonios</h2>
            <form onSubmit={handleTestimonialSubmit} className="space-y-4 mb-6">
              <Input
                type="text"
                name="name"
                value={testimonialForm.name}
                onChange={(e) =>
                  setTestimonialForm({ ...testimonialForm, name: e.target.value })
                }
                placeholder="Nombre"
                label="Nombre"
                required
                className="w-full"
              />
              <Input
                type="textarea"
                name="comment_es"
                value={testimonialForm.comment?.es || ""}
                onChange={(e) =>
                  setTestimonialForm({ ...testimonialForm, comment: { ...testimonialForm.comment, es: e.target.value } })
                }
                placeholder="Comentario en español"
                label="Comentario en español"
                required
                className="w-full"
              />
              <Input
                type="textarea"
                name="comment_en"
                value={testimonialForm.comment?.en || ""}
                onChange={(e) =>
                  setTestimonialForm({ ...testimonialForm, comment: { ...testimonialForm.comment, en: e.target.value } })
                }
                placeholder="Comentario en inglés"
                label="Comentario en inglés"
                required
                className="w-full"
              />
              <Button
                buttonLabel={loading ? "Procesando..." : editingTestimonial ? "Guardar Cambios" : "Agregar Testimonio"}
                buttonType="dark"
                buttonHtmlType="submit"
                className="w-full"
                disabled={loading}
              />
            </form>
            <ul className="space-y-4">
              {filteredTestimonials.map((testimonial) => (
                <li key={testimonial._id} className="border p-4 rounded flex justify-between">
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p>{testimonial.comment[locale as "es" | "en"]}</p>
                  </div>
                  <div className="flex space-x-4">
                    <Button
                      buttonLabel="Editar"
                      onButtonClick={() => handleEditTestimonial(testimonial)}
                      buttonType="dark"
                      className="px-4 py-2 m-1 mb-6.5 pt-2.5 pb-2 pl-3.5 pr-3 rounded"
                    />
                    <Button
                      buttonLabel="Eliminar"
                      onButtonClick={() => handleDeleteTestimonial(testimonial._id!)}
                      buttonType="dark"
                      className="px-4 py-2 m-1 mb-6.5 pt-2.5 pb-2 pl-3.5 pr-3 rounded"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
  
        {currentTab === "services" && (
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Servicios</h2>
            <form onSubmit={handleServiceSubmit} className="space-y-4 mb-6">
               {/* Campos para el nombre en ambos idiomas */}
               <h3 className="font-bold">Nombre del Servicio</h3>
              <Input
                type="text"
                name="name_es"
                value={serviceForm.name.es}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    name: { ...serviceForm.name, es: e.target.value },
                  })
                }
                placeholder="Nombre del Servicio (ES)"
                label="Nombre (ES)"
                required
                className="w-full"
              />
              <Input
                type="text"
                name="name_en"
                value={serviceForm.name.en}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    name: { ...serviceForm.name, en: e.target.value },
                  })
                }
                placeholder="Nombre del Servicio (EN)"
                label="Nombre (EN)"
                required
                className="w-full"
              />
              <h3 className="font-bold">Descripción del Servicio</h3>
              <Input
                type="textarea"
                name="description_es"
                value={serviceForm.description.es}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    description: { ...serviceForm.description, es: e.target.value },
                  })
                }
                placeholder="Descripción del Servicio (ES)"
                label="Descripción (ES)"
                required
                className="w-full"
              />
              <Input
                type="textarea"
                name="description_en"
                value={serviceForm.description.en}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    description: { ...serviceForm.description, en: e.target.value },
                  })
                }
                placeholder="Descripción del Servicio (EN)"
                label="Descripción (EN)"
                required
                className="w-full"
              />
              <Input
                type="text"
                name="price"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                placeholder="Precio"
                label="Precio"
                required
                className="w-full"
              />
              <Input
                type="select"
                name="vehicleType"
                value={serviceForm.vehicleType}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    vehicleType: e.target.value as "Automóvil" | "Motocicleta" | "Camión",
                  })
                }
                options={vehicleTypeOptions}
                label={locale === "en" ? "Vehicle Type" : "Tipo de Vehículo"}
                required
                className="w-full"
              />
              <Button
                buttonLabel={loading ? "Procesando..." : editingService ? "Actualizar Servicio" : "Agregar Servicio"}
                buttonType="dark"
                buttonHtmlType="submit"
                className="w-full"
                disabled={loading}
              />
            </form>
            <ul className="space-y-4">
              {filteredServices.map((service) => (
                <li key={service._id} className="flex justify-between items-center p-4 border rounded-md shadow-sm">
                  <div>
                    <p className="font-semibold">{service.name.es}</p>
                    <p className="text-sm text-gray-500">{service.description.es}</p>
                    <p className="text-sm text-gray-500">{service.price}</p>
                    <p className="text-sm text-gray-500">{service.vehicleType}</p>
                  </div>
                  <div className="flex space-x-4">
                    <Button
                      buttonLabel={service.featured ? "Quitar de Destacados" : "Añadir a Destacados"}
                      onButtonClick={() => handleToggleFeatured(service._id!, service.featured)}
                      buttonType="light"
                      className="px-4 py-2 m-1"
                    />
                    <Button
                      buttonLabel="Editar"
                      onButtonClick={() => handleEditService(service)}
                      buttonType="light"
                      className="px-4 py-2 m-1"
                    />
                    <Button
                      buttonLabel="Eliminar"
                      onButtonClick={() => handleDeleteService(service._id!)}
                      buttonType="light"
                      className="px-4 py-2 m-1"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {currentTab === "translations" && (
          <AdminTranslationsPanel />
        )}
      </main>
    </div>
  );
}  