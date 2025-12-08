import React from "react";

const Panel = ({
  children,
  variant = "card",
  size = "md",
  padding = true,
  hover = "shadow",
  className = "",
  ...props
}) => {
  // Base styles that all panels share
  const baseStyles = "bg-white border border-gray-200 overflow-hidden transition-all duration-300";

  // Variant-specific styles
  const variantStyles = {
    card: "rounded-sm shadow-sm",
    "admin-form": "rounded-sm border-gray-100 shadow-sm",
    article: "rounded-sm shadow-sm",
    stats: "rounded-sm border-gray-200 shadow-sm",
    ad: "rounded-sm shadow-md",
    minimal: "rounded-sm shadow-sm border-gray-200",
  };

  // Size-specific styles
  const sizeStyles = {
    sm: padding ? "p-3" : "",
    md: padding ? "p-4" : "",
    lg: padding ? "p-6" : "",
    xl: padding ? "p-8" : "",
  };

  // Hover effect styles
  const hoverStyles = {
    shadow: "hover:shadow-md",
    scale: "hover:scale-105",
    border: "hover:border-blue-200",
    "shadow-lg": "hover:shadow-lg",
    "scale-shadow": "hover:scale-105 hover:shadow-md",
    none: "",
  };

  // Special combinations for existing patterns
  const specialStyles = {
    card: "hover:border-blue-200 hover:shadow-md group cursor-pointer",
    "admin-form": "",
    article: "",
    stats: "hover:scale-105 hover:shadow-md",
    ad: "hover:shadow-lg transition-shadow",
    minimal: "",
  };

  const combinedClasses = [
    baseStyles,
    variantStyles[variant] || variantStyles.card,
    sizeStyles[size],
    specialStyles[variant] || hoverStyles[hover],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

export default Panel;
