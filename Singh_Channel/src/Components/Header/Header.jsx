import React from "react";
import Topbar from "./Topbar";
import { NavLink } from "react-router-dom";
import Button from "../Ui/Button";
import { User } from "lucide-react";
import Breaking from "./Breaking";
function Header() {
    const navItems = [
        { name: "Home", path: "/" },
        { name: "News", path: "/news" },
        { name: "Events", path: "/events" },
        { name: "Business", path: "/business" },
        { name: "Directory", path: "/directory" },
    ];
    return (
        <div className="relative">
            <Topbar />
            <header className="sticky top-0 z-50 w-full bg-slate-900">
                <div className="mx-auto max-w-7xl px-4 py-1 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-1">
                        <NavLink to="/" className="flex items-center space-x-2">
                            <img
                                src="/logo.png"
                                alt="logo"
                                className="h-7 w-7 rounded-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                            <span className="text-base font-bold text-white sm:block">
                                Singh Channel
                            </span>
                        </NavLink>

                        {/* Desktop Navigation */}
                        <nav className="hidden space-x-4 lg:flex">
                            {navItems.map((item, i) => (
                                <NavLink
                                    key={i}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `group font-Montserrat relative px-3 py-1 text-sm transition-all duration-300 ${
                                            isActive
                                                ? "text-sky-400"
                                                : "text-white hover:bg-slate-700 hover:text-sky-400"
                                        }`
                                    }
                                >
                                    {item.name}
                                    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-sky-400 transition-all duration-300 group-hover:w-full"></span>
                                    <span className="absolute top-0 right-0 h-[2px] w-0 bg-sky-400 transition-all duration-300 group-hover:w-full"></span>
                                </NavLink>
                            ))}

                            {
                                <NavLink
                                    to="/admin"
                                    className="group font-Montserrat relative rounded-md px-3 py-1 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-700 hover:text-sky-400"
                                >
                                    Admin
                                    <div className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-sky-400 transition-all duration-300 group-hover:w-full" />
                                </NavLink>
                            }
                        </nav>
                        <div>
                            <Button>
                                <User
                                    size={16}
                                    className="text-sky-400"
                                    strokeWidth={3}
                                />
                                <span className="text-sm">Login</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            <Breaking />
        </div>
    );
}

export default Header;
