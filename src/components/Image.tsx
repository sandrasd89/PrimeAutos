import React from "react";

interface ImageProps {
  src: string; // URL de la imagen
  alt: string; // Texto alternativo para accesibilidad
  width?: number; // Ancho de la imagen (opcional)
  height?: number; // Altura de la imagen (opcional)
  className?: string; // Clases adicionales para estilos personalizados
  onError?: () => void; // Manejador de errores de carga (opcional)
}

const ImageComponent: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  onError,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg shadow-md ${className}`} // Estilos por defecto + personalizados
      onError={onError} // Lógica en caso de error
    />
  );
};

export default ImageComponent;
