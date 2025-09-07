import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
}: ButtonProps) => {
  const base = "rounded font-medium focus:outline-none transition-colors";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`${className} ${base} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
};

export default Button;
