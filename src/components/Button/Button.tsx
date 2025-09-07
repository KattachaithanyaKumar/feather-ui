import React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
};

const base =
  "rounded font-medium focus:outline-none transition-colors inline-flex items-center justify-center";

const variants = {
  default: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  primary: "bg-primary hover:opacity-90",
  danger: "bg-danger hover:opacity-90",
  success: "bg-success hover:opacity-90",
  warning: "bg-warning hover:opacity-90",
};

const sizes = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "md",
  className,
  disabled = false,
  ...rest
}) => {
  const disabledStyles = `${
    disabled ? "cursor-not-allowed" : "cursor-pointer"
  }`;

  return (
    <button
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        disabledStyles,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
