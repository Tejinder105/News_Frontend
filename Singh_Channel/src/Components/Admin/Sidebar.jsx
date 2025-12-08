import {
  FilePlus2,
  LayoutDashboard,
  Newspaper,
  PanelRightOpen,
  Settings,
  Menu as MenuIcon,
  LogOut,
  X,
  Calendar,
  CalendarPlus,
} from "lucide-react";
import Logo from "../Ui/Logo";
import Button from "../Ui/Button";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ open, setOpen }) {
  const [isMobile, setIsMobile] = useState(false);

  const menus = [
    { name: "Dashboard", link: "/admin", icon: <LayoutDashboard size={20} /> },
    {
      name: "All Articles",
      link: "/admin/allarticles",
      icon: <Newspaper size={20} />,
    },
    {
      name: "Add Articles",
      link: "/admin/createarticles",
      icon: <FilePlus2 size={20} />,
    },

    { name: "Settings", link: "/admin/settings", icon: <Settings size={20} /> },
  ];

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <>
      {isMobile && open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`${isMobile
          ? `fixed top-0 left-0 z-50 h-screen border-r border-slate-800 bg-slate-900 text-gray-100 shadow-2xl duration-300 ease-in-out ${open ? "w-72" : "w-0"} ${!open ? "-translate-x-full" : "translate-x-0"}`
          : `relative border-r border-slate-800 bg-slate-900 text-gray-100 shadow-xl duration-300 ease-in-out ${open ? "w-72" : "w-20"}`
          } overflow-hidden`}
      >
        <div className="flex items-center justify-between border-b border-slate-600/50 bg-slate-800 p-4">
          {open && (
            <div className="flex items-center gap-3">
              <div className="flex  items-center justify-center rounded-lg">
                <Logo size="normal" />
              </div>
            </div>
          )}
          <Button
            variant="icon-dark"
            onClick={() => setOpen(!open)}
            iconLeft={isMobile ? <X size={20} /> : <PanelRightOpen size={20} />}
            className="text-slate-400 hover:text-white"
          />
        </div>

        {/* Navigation */}
        <div className="mt-6 flex h-[calc(100vh-80px)] flex-col justify-between px-3">
          <div className="flex flex-grow flex-col space-y-2">
            {menus.map((menu, i) => (
              <NavLink
                to={menu.link}
                key={i}
                end={menu.link === "/admin"}
                className={({ isActive }) =>
                  `group flex items-center gap-4 rounded-xl p-3 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none ${isActive
                    ? "border border-blue-400 bg-slate-800 text-blue-400 shadow-md"
                    : "text-slate-300 hover:bg-slate-700 hover:text-blue-400"
                  }`
                }
                onClick={() => isMobile && setOpen(false)}
                tabIndex={0}
                aria-label={menu.name}
              >
                <div
                  className={`flex-shrink-0 transition-all duration-200 ${open ? "scale-100" : "scale-110"
                    }`}
                >
                  {menu.icon}
                </div>
                <span
                  style={{ transitionDelay: `${i * 50}ms` }}
                  className={`whitespace-nowrap transition-all duration-300 ${!open ? "translate-x-8 overflow-hidden opacity-0" : ""
                    }`}
                >
                  {menu.name}
                </span>
              </NavLink>
            ))}
          </div>

          {/* Logout Button */}
          <div className="mt-auto mb-6">
            <Button
              variant="danger"
              size="md"
              className={`w-full transition-all duration-200 ${!open ? "justify-center px-3" : "justify-start"
                }`}
              iconLeft={<LogOut size={20} />}
              onClick={handleLogout}
            >
              {open && (
                <span
                  style={{ transitionDelay: "200ms" }}
                  className="whitespace-nowrap transition-all duration-300"
                >
                  Logout
                </span>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
