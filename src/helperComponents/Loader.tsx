import React from "react";

export type LoaderProps = {
  size?: number;
  className?: string;
};

const Loader: React.FC<LoaderProps> = ({ size = 20, className = "" }) => {
  return (
    <svg
      className={`animate-spin text-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Loader;
