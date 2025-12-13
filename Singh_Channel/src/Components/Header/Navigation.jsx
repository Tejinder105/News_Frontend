import React from "react";
import { NavLink } from "react-router-dom";
import { navItems } from "../../Constants/Navigation";
import { useAdminCheck } from "../../hooks/useAdminCheck";

const Navigation = ({ classname = "", variant = "desktop" }) => {
    const { isAdmin } = useAdminCheck();

    const baseclasses =
        "group font-Montserrat relative transition-all duration-300";

    const variantClasses = {
        desktop: `${baseclasses} px-3 py-1 text-sm flex items-center`,
        mobile: `${baseclasses} block rounded-md px-4 py-2 text-center text-sm `,
    };

    const getLinkClasses = (isActive) => {
        if (variant === "desktop") {
            return `${variantClasses.desktop}
        ${isActive
                    ? `text-sky-400`
                    : `text-white hover:bg-slate-700 hover:text-sky-400`
                }`;
        } else {
            return `${variantClasses.mobile} ${isActive
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
                <div key={index} className="group/dropdown relative">
          {item.children ? (
            <>
              <div
                className={`${
                  variant === "desktop"
                    ? "flex cursor-pointer items-center gap-1 px-3 py-1 text-sm text-white hover:bg-slate-700 hover:text-sky-400"
                    : "block rounded-md px-4 py-2 text-center text-sm text-white hover:bg-sky-600/50"
                }`}
              >
                {item.name}
                {variant === "desktop" && (
                  <svg
                    className="h-4 w-4 transition-transform group-hover/dropdown:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </div>

              {/* Dropdown Menu */}
              <div
                className={`${
                  variant === "desktop"
                    ? "ring-opacity-5 invisible absolute left-0 z-50 mt-0 w-48 translate-y-2 rounded-md bg-white opacity-0 shadow-lg ring-1 ring-black transition-all duration-200 group-hover/dropdown:visible group-hover/dropdown:translate-y-0 group-hover/dropdown:opacity-100"
                    : "mt-2 space-y-2 pl-4"
                }`}
              >
                <div className={variant === "desktop" ? "py-1" : ""}>
                  {item.children.map((child, childIndex) => (
                    <NavLink
                      key={childIndex}
                      to={child.path}
                      className={({ isActive }) =>
                        variant === "desktop"
                          ? `block px-4 py-2 text-sm ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"}`
                          : `block rounded-md py-2 text-sm ${isActive ? "text-blue-400" : "text-gray-300 hover:text-white"}`
                      }
                    >
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <NavLink
              to={item.path}
              className={({ isActive }) => getLinkClasses(isActive)}
            >
              {item.name}
              {variant === "desktop" && (
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-sky-400 transition-all duration-300 group-hover:w-full" />
              )}
            </NavLink>
          )}
        </div>
      ))}

      {/* Admin */}
      {isAdmin && (
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            variant === "desktop"
              ? "group relative rounded-md px-3 py-1 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-700 hover:text-sky-400"
              : `block rounded-md px-4 py-2 text-center text-sm font-semibold transition-all duration-300 ${
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
      )}
    </nav>
  );
};

export default Navigation;
