import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayout from "./Layouts/UserLayout";
import AdminLayout from "./Layouts/AdminLayout";
import Home from "./Pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      // {
      //   path:"/newsarticle/:id"
      // },
      // {
      //   path:"/admin",
      //   element:<AdminLayout/>,
      //   children:[
      //     {
      //       path:"/admin",
      //     }
      //   ]
      // },
      // {
      //   path
      // }
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
