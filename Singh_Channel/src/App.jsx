import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayout from "./Layouts/UserLayout";
import AdminLayout from "./Layouts/AdminLayout";
import Home from "./Pages/Home";
import Navigator from "./Pages/Navigator";
import Article from "./Pages/Article";
import NewsArticle from "./Pages/NewsArticle";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/nav",
        element: <Navigator />,
      },
      {
        path: "/article/:id",
        element: <NewsArticle/>
      },
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
