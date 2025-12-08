import React, { Suspense, lazy } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Footer, Header } from "../Components";
import { useBreakingNews } from "../hooks/useBreakingNews";

function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useBreakingNews();

  return (
    <div>
      <Header />
      <Outlet />

      <Footer />
    </div>
  );
}

export default UserLayout;
