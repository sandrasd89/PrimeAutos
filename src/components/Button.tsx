import React from "react";

interface ButtonProps {
  buttonLabel: React.ReactNode; // Texto del botón
  onButtonClick?: () => void; // Función para manejar clics
  buttonType?: "dark" | "light"; // Estilo del botón: oscuro o claro
  className?: string; // Clases CSS adicionales
  buttonHtmlType?: "button" | "submit" | "reset"; // Tipo del botón HTML
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  buttonLabel,
  onButtonClick,
  buttonType = "light", // Por defecto, el fondo claro
  className = "",
  buttonHtmlType = "button", // Por defecto, tipo HTML es `button`
  disabled = false,

} : ButtonProps) => {
  // Estilos del botón según el tipo
  const darkButtonClassName =
  "bg-yellow-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-400 hover:text-gray-900 transition duration-300 cursor-pointer";
  const lightButtonClassName =
  "bg-gray-800 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 hover:text-yellow-500 transition duration-300 cursor-pointer";
  
  const appliedClassName = buttonType === "dark" ? darkButtonClassName : lightButtonClassName;


  return (
    <button
      type={buttonHtmlType}
      onClick={onButtonClick}
      className={`${appliedClassName} ${className}`}
      disabled={disabled}
    >
      {buttonLabel}
    </button>
  );
};

export default Button;
