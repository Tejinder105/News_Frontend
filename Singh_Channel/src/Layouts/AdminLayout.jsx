import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Admin/Sidebar";

function AdminLayout() {
  const [sideOpen, setSideOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setSideOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen w-full  bg-slate-100">
      <Sidebar open={sideOpen} setOpen={setSideOpen} />

      <main
        className={`h-full overflow-y-auto transition-all duration-300 ${
          sideOpen ? "pl-72" : "pl-20"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}


export default AdminLayout;