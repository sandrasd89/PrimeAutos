export const getAccessToken = async () => {
    let token = localStorage.getItem("token");
  
    if (!token) {
      try {
        // Intentar refrescar el token si no existe en localStorage
        const response = await fetch("/api/refreshToken", { method: "POST", credentials: "include" });
        const data = await response.json();
  
        if (data.success && data.accessToken) {
          localStorage.setItem("token", data.accessToken); // Guardar el nuevo token en localStorage
          token = data.accessToken;
        } else {
          throw new Error("No se pudo refrescar el token");
        }
      } catch (error) {
        console.error("Error obteniendo el token:", error);
        localStorage.removeItem("token"); // Si falla, eliminar cualquier token viejo
        return null;
      }
    }
  
    return token;
  };
  