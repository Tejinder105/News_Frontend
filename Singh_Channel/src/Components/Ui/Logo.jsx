import React from "react";
import { NavLink } from "react-router-dom";

const Logo = ({ className = "", showText = true, size = "normal" }) => {
  const sizes = {
    small: "h-6 w-6",
    normal: "h-7 w-7",
    large: "h-8 w-8",
  };
  const textSizesClasses = {
    small: "text-sm",
    normal: "text-base",
    large: "text-lg",
  };
  return (
    <NavLink
      to="/"
      className={`flex items-center space-x-2 transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <img
        src="logo.png"
        alt="singh channel logo"
        className={`${sizes[size]} rounded-full object-cover shadow-sm`}
      />
      {showText && (
        <span className={`${textSizesClasses[size]} font-bold text-white`}>
          Singh Channel
        </span>
      )}
    </NavLink>
  );
};

export default Logo;
