import React from "react";

function Button({
  children,
  type = "button",
  classname = "",
  size = "medium",
  variant = "default",
  iconLeft,
  iconRight,
  ...props
}) {
  const baseClasses =
    "flex items-center justify-center gap-1.5 rounded-md transition-colors duration-300 focus-outline-none  text-base font-semibold";

    const variantClasses={
        default:"text-white",
        outline:"bg-transparent text-white hover:bg-blue-400",
        ghost:"bg-transparent backdrop-blur-md border border-white/20 text-white hover:white/10 "
    }
    const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };
  return (
    <div type={type} className={`${baseClasses} ${classname} ${variantClasses[variant]} ${sizeClasses[size]} `} {...props}>
      {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </div>
  );
}

export default Button;
