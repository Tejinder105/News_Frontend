import React from "react";

function Button({
  children,
  type = "button",
  bgColor = "bg-blue-500",
  textColor = "text-white",
  className = "",
  iconLeft,
  iconRight,
  ...props
}) {
  return (
    <button
      type={type} 
      className={`flex items-center gap-2 rounded-lg px-2 py-1 ${className} ${textColor} ${bgColor} `}
      {...props}
    >
      {iconLeft && iconLeft}
      {children}
      {iconRight && iconRight}
    </button>
  );
}

export default Button;
