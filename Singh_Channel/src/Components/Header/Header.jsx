import React, { useState, useEffect } from "react";
import Topbar from "./Topbar";
import { NavLink, useLocation } from "react-router-dom";
import Button from "../Ui/Button";
import { Menu, User, X } from "lucide-react";
import Breaking from "./Breaking";
import { AnimatePresence, motion } from "framer-motion";

function Header() {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
    { name: "Events", path: "/events" },
    { name: "Business", path: "/business" },
    { name: "Directory", path: "/directory" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="relative">
      <Topbar />

      <header className="sticky top-0 z-50 w-full bg-slate-900 shadow">
        <div className="mx-auto max-w-7xl px-4 py-1 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1">
            {/* Logo (Hide when mobile menu open) */}
            {!isMenuOpen && (
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
            )}

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
                </NavLink>
              ))}
              <NavLink
                to="/admin"
                className="group relative rounded-md px-3 py-1 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-700 hover:text-sky-400"
              >
                Admin
                <div className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-sky-400 transition-all duration-300 group-hover:w-full" />
              </NavLink>
            </nav>

            {/* Buttons (Hide menu button when open) */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex">
                <Button
                  variant="outline"
                  size="small"
                  iconLeft={
                    <User size={16} className="text-sky-400" strokeWidth={3} />
                  }
                >
                  <span className="text-sm">Login</span>
                </Button>
              </div>

              {!isMenuOpen && (
                <Button
                  className="lg:hidden"
                  onClick={() => setIsMenuOpen(true)}
                  aria-label="Open Menu"
                >
                  <Menu className="text-white" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu with animation */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Dark backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Menu Panel */}
              <motion.div
                key="mobile-menu"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 left-0 z-50 max-h-[90vh] w-full overflow-y-auto bg-slate-900 px-6 pt-4 pb-6 shadow-xl lg:hidden"
              >
                {/* Top row: logo + close */}
                <div className="mb-4 flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/logo.png"
                      alt="logo"
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="text-base font-bold text-white">
                      Singh Channel
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                    className="text-white"
                  >
                    <X />
                  </button>
                </div>

                {/* Nav Items */}
                <nav className="flex flex-col space-y-3">
                  {navItems.map((item, index) => (
                    <NavLink
                      key={index}
                      to={item.path}
                      className={({ isActive }) =>
                        `font-Montserrat block rounded-md px-4 py-2 text-center text-sm transition-all duration-300 ${
                          isActive
                            ? "border border-sky-400 bg-slate-700 text-sky-400"
                            : "text-white hover:bg-sky-600/50"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <Breaking />
    </div>
  );
}

export default Header;
