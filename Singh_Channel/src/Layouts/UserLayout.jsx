import React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header } from "../Components";
import { useBreakingNews } from "../hooks/useBreakingNews";

function UserLayout() {
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
