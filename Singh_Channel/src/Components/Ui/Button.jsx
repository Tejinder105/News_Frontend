import React from "react";

function Button({
  children,
  type = "button",
  bgColor = "bg-blue-500",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <div
      className={`rounded-lg px-4 py-2 ${className} ${textColor} ${bgColor}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Button;
