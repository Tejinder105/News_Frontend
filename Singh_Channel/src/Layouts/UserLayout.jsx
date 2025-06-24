import React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header } from "../Components";

function UserLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default UserLayout;
