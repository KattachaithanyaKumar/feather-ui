import React, { forwardRef, type ReactNode } from "react";
import clsx from "clsx";
import Loader from "../../helperComponents/Loader";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | "default"
    | "primary"
    | "danger"
    | "success"
    | "warning"
    | "dashed"
    | "text";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  block?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  ghost?: boolean;
};

const base =
  "rounded-md font-medium focus:outline-none transition-colors inline-flex items-center justify-center gap-2 shadow-sm";

const variants = {
  default:
    "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-300 disabled:text-gray-500 shadow-sm",
  primary:
    "bg-primary text-white hover:opacity-90 disabled:opacity-60 disabled:hover:opacity-60 shadow-sm",
  danger:
    "bg-danger text-white hover:opacity-90 disabled:opacity-60 disabled:hover:opacity-60 shadow-sm",
  success:
    "bg-success text-white hover:opacity-90 disabled:opacity-60 disabled:hover:opacity-60 shadow-sm",
  warning:
    "bg-warning text-white hover:opacity-90 disabled:opacity-60 disabled:hover:opacity-60 shadow-sm",
  dashed:
    "border-2 border-dashed border-gray-400 text-gray-700 hover:border-gray-600 hover:text-gray-900 disabled:border-gray-300 disabled:text-gray-400",
  text: "bg-transparent text-black hover:bg-gray-200 disabled:opacity-80 disabled:bg-gray-80",
};

const sizes = {
  sm: "px-8 py-1 text-sm",
  md: "px-10 py-2 text-base",
  lg: "px-12 py-3 text-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "default",
      size = "md",
      className,
      disabled = false,
      icon,
      iconPosition = "start",
      loading = false,
      block = false,
      ghost = false,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const renderStart = () => {
      if (loading && iconPosition === "start")
        return <Loader size={18} aria-hidden="true" />;

      if (!loading && icon && iconPosition === "start")
        return <span className="flex items-center">{icon}</span>;

      return null;
    };

    const renderEnd = () => {
      if (loading && iconPosition === "end")
        return <Loader size={18} aria-hidden="true" />;

      if (!loading && icon && iconPosition === "end")
        return <span className="flex items-center">{icon}</span>;

      return null;
    };

    // ghost mode overrides everything: transparent bg + border
    const ghostClasses = ghost
      ? "bg-transparent border-2 text-gray-800 border-gray-400 hover:bg-gray-100"
      : null;

    const normalClasses = ghost ? null : variants[variant];

    return (
      <button
        ref={ref}
        type={rest.type ?? "button"}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading || undefined}
        className={clsx(
          base,
          ghost ? ghostClasses : normalClasses,
          sizes[size],
          isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          className,
          block ? "w-full" : "w-fit"
        )}
        {...rest}
      >
        {renderStart()}

        <span className={clsx(loading ? "opacity-90" : "opacity-100")}>
          {children}
        </span>

        {renderEnd()}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
