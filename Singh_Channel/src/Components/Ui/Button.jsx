import React from "react";
import Spinner from "./Spinner";

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  iconLeft,
  iconRight,
  disabled = false,
  loading = false,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

  const sizeStyles = {
    xs: "px-2 py-1 text-xs gap-1 rounded",
    sm: "px-3 py-1 text-sm gap-1.5 rounded-lg",
    md: "px-3 py-2 text-sm gap-2 rounded-lg",
    lg: "px-4 py-2 text-base gap-2 rounded-lg",
  };

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",

    secondary: "bg-gray-600 text-white hover:bg-gray-700 shadow-sm",

    success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",

    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",

    outline:
      "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50",

    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",

    language: "bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white",
    "language-active": "bg-blue-600 text-white shadow-sm",

    icon: "bg-transparent hover:bg-gray-100 text-gray-600 p-1.5 rounded-lg",
    "icon-dark":
      "bg-transparent hover:bg-white/10 text-white/80 hover:text-white p-1.5 rounded-lg",

    overlay:
      "bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm rounded-full p-2",

    "auth-login":
      "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 border border-blue-500 shadow-md hover:shadow-lg",
    "auth-logout":
      "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 border border-red-500 shadow-md hover:shadow-lg",
    "auth-outline-login":
      "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white backdrop-blur-sm",
    "auth-outline-logout":
      "bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white backdrop-blur-sm",

    "header-auth-login":
      "bg-white/10 border border-white/20 text-white hover:bg-blue-600 hover:border-blue-500 backdrop-blur-sm",
    "header-auth-logout":
      "bg-white/10 border border-white/20 text-white hover:bg-red-600 hover:border-red-500 backdrop-blur-sm",

    fab: "bg-sky-500 text-white hover:bg-sky-600 hover:scale-110 shadow-lg rounded-full p-3",
  };

  const buttonClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {iconLeft && iconLeft}
          {children && <span>{children}</span>}
          {iconRight && iconRight}
        </>
      )}
    </button>
  );
}

export default Button;
