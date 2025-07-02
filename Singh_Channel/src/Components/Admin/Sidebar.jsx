import {
  FilePlus2,
  LayoutDashboard,
  Newspaper,
  PanelRightOpen,
  Settings,
  Menu as MenuIcon,
  LogOut,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ open, setOpen }) {
  const [isMobile, setIsMobile] = useState(false);

  const menus = [
    { name: "Dashboard", link: "/admin", icon: <LayoutDashboard size={20} /> },
    {
      name: "All Articles",
      link: "/admin/allArticles",
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
    <div className="relative">
      {/* Mobile Menu Button */}
      {isMobile && !open && (
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg bg-blue-600 p-3 text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl"
          >
            <MenuIcon size={20} />
          </button>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-slate-900 text-gray-100 shadow-2xl duration-300 ease-in-out md:z-10 ${
          open ? "w-72" : "w-20"
        } ${isMobile && !open ? "-translate-x-full" : ""}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-600/50 bg-slate-800 p-4">
          {open && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-sm font-bold text-white">SC</span>
              </div>
              <h1 className="text-xl font-bold whitespace-nowrap text-blue-400 transition-all duration-300 delay-200">
                Singh Channel
              </h1>
            </div>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-slate-700 hover:text-white"
          >
            {isMobile ? <X size={20} /> : <PanelRightOpen size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex h-[calc(100vh-80px)] flex-col justify-between px-3">
          <div className="flex flex-grow flex-col space-y-2">
            {menus.map((menu, i) => (
              <NavLink
                to={menu.link}
                key={i}
                className={({ isActive }) =>
                  `group flex items-center gap-4 rounded-xl p-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-slate-700 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
                onClick={() => isMobile && setOpen(false)}
              >
                <div
                  className={`flex-shrink-0 transition-all duration-200 ${
                    open ? "scale-100" : "scale-110"
                  }`}
                >
                  {menu.icon}
                </div>
                <span
                  style={{ transitionDelay: `${i * 50}ms` }}
                  className={`whitespace-nowrap transition-all duration-300 ${
                    !open ? "translate-x-8 overflow-hidden opacity-0" : ""
                  }`}
                >
                  {menu.name}
                </span>
              </NavLink>
            ))}
          </div>

          {/* Logout Button */}
          <div className="mt-auto mb-6">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center gap-4 rounded-xl p-3 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300 hover:shadow-md"
            >
              <div className="flex-shrink-0">
                <LogOut size={20} />
              </div>
              <span
                style={{ transitionDelay: "200ms" }}
                className={`whitespace-nowrap transition-all duration-300 ${
                  !open ? "translate-x-8 overflow-hidden opacity-0" : ""
                }`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
