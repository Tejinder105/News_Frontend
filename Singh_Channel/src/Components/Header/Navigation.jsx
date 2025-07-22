import React from "react";
import { NavLink } from "react-router-dom";
import { navItems } from "../../Constants/Navigation";

const Navigation = ({ classname = "", variant = "desktop" }) => {
  const baseclasses =
    "group font-Montserrat relative transition-all duration-300";

  const variantClasses = {
    desktop: `${baseclasses} px-3 py-1 text-sm`,
    mobile: `${baseclasses} block rounded-md px-4 py-2 text-center text-sm `,
  };

  const getLinkClasses = (isActive) => {
    if (variant === "desktop") {
      return `${variantClasses.desktop}
        ${
          isActive
            ? `text-sky-400`
            : `text-white hover:bg-slate-700 hover:text-sky-400`
        }`;
    } else {
      return `${variantClasses.mobile} ${
        isActive
          ? `border border-sky-400 bg-slate-700 text-sky-400`
          : `text-white hover:bg-sky-600/50`
      }`;
    }
  };

  const containerClasses =
    variant === "desktop"
      ? `hidden space-x-4 lg:flex ${classname}`
      : `flex flex-col space-y-3 ${classname}`;

  return (
    <nav className={containerClasses}>
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) => getLinkClasses(isActive)}
        >
          {item.name}
          {variant === "desktop" && (
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-sky-400 transition-all duration-300 group-hover:w-full" />
          )}
        </NavLink>
      ))}

      {/* Admin */}
      <NavLink
        to="/admin"
        className={({ isActive }) =>
          variant === "desktop"
            ? "group relative rounded-md px-3 py-1 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-700 hover:text-sky-400"
            : `block rounded-md px-4 py-2 text-center text-sm font-semibold text-white transition-all duration-300 ${
                isActive
                  ? "border border-sky-400 bg-slate-700 text-sky-400"
                  : "text-white hover:bg-sky-600/50"
              }`
        }
      >
        Admin
        {variant === "desktop" && (
          <div className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-sky-400 transition-all duration-300 group-hover:w-full"></div>
        )}
      </NavLink>
    </nav>
  );
};

export default Navigation;
