import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { navItems } from "../../Constants/Navigation";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../../Services/apiClient";

const Navigation = ({ classname = "", variant = "desktop" }) => {
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const [isAdmin, setIsAdmin] = useState(false);

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

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (isAuthenticated && user) {
                try {
                    const token = await getAccessTokenSilently();

                    const response = await api.get("/api/v1/users/profile", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const profile = response.data;
                    console.log(profile);
                    setIsAdmin(
                        profile.user.roles?.some(
                            (role) => role.toLowerCase() === "admin"
                        )
                    );
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            }
        };

        fetchUserProfile();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    return (
        <nav className={containerClasses}>
            {navItems.map((item, index) => (
                <div key={index} className="relative group/dropdown">
                    {item.children ? (
                        <>
                            <div
                                className={`${variant === "desktop"
                                    ? "px-3 py-1 text-sm text-white hover:bg-slate-700 hover:text-sky-400 cursor-pointer flex items-center gap-1"
                                    : "block rounded-md px-4 py-2 text-center text-sm text-white hover:bg-sky-600/50"
                                    }`}
                            >
                                {item.name}
                                {variant === "desktop" && (
                                    <svg className="w-4 h-4 transition-transform group-hover/dropdown:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </div>

                            {/* Dropdown Menu */}
                            <div className={`${variant === "desktop"
                                ? "absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 invisible opacity-0 translate-y-2 group-hover/dropdown:visible group-hover/dropdown:opacity-100 group-hover/dropdown:translate-y-0 transition-all duration-200 z-50"
                                : "pl-4 space-y-2 mt-2"
                                }`}>
                                <div className={variant === "desktop" ? "py-1" : ""}>
                                    {item.children.map((child, childIndex) => (
                                        <NavLink
                                            key={childIndex}
                                            to={child.path}
                                            className={() =>
                                                variant === "desktop"
                                                    ? `block  px-4 py-2 text-sm bg-gray-100 text-sky-00' hover:bg-gray-100 hover:text-sky- 600'}`
                                                    : `block rounded-md py-2  text-sm  text- g ray-300 ho ver: t ext-white`
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
                            : `block rou n ded-m d  px- 4  py-2  t ext-center  t ext-sm  f ont-semibold  t ext-white transi t ion-all dura t ion-30
    0 ${isActive
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
