import React from "react";

function Button({
  children,
  type = "button",
  variant = "primary", // "primary" or "outline"
  className = "",
  iconLeft,
  iconRight,
  ...props
}) {
  // Define base styles for each variant
  const variantStyles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-3 py-1  transition-colors",
    outline:
      "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full px-2 py-1 transition-colors",
  };

  return (
    <button
      type={type}
      className={`flex items-center gap-2 font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {iconLeft && iconLeft}
      {children}
      {iconRight && iconRight}
    </button>
  );
}

export default Button;
