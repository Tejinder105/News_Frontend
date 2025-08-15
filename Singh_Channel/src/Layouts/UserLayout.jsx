import React, { Suspense, lazy } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Footer, Header } from "../Components";

function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <Outlet />

      <Footer />
    </div>
  );
}

export default UserLayout;
