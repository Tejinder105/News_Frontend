import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Admin/Sidebar";
import { MenuIcon } from "lucide-react";

function AdminLayout() {
  const [sideOpen, setSideOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const currentIsMobile = window.innerWidth < 768;
      setIsMobile(currentIsMobile);

      if (currentIsMobile) {
        setSideOpen(false);
      } else {
        setSideOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex h-screen overflow-hidden">
        <Sidebar open={sideOpen} setOpen={setSideOpen} />
        <div className="flex flex-1 flex-col overflow-hidden">
          {isMobile && !sideOpen && (
            <div className="flex h-16 items-center border-b border-gray-200 bg-slate-900 px-4 md:hidden">
              <button
                onClick={() => setSideOpen(true)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <MenuIcon size={20} />
              </button>
              <h1 className="ml-3 text-lg font-semibold text-white">
                Singh Channel Admin
              </h1>
            </div>
          )}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
