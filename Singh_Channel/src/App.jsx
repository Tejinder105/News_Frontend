import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayout from "./Layouts/UserLayout";
import AdminLayout from "./Layouts/AdminLayout";
import Home from "./Pages/Home";
import NewsArticle from "./Pages/NewsArticle";
import Dashboard from "./Pages/Admin/Dashboard";
import CreateArticle from "./Pages/Admin/CreateArticle";
import AllArticle from "./Pages/Admin/AllArticle";
import EditArticle from "./Pages/Admin/EditArticle";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import CategoryPage from "./Pages/CategoryPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/article/:id",
        element: <NewsArticle />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/category/:tag",
        element: <CategoryPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "createarticles",
        element: <CreateArticle />,
      },
      {
        path: "allarticles",
        element: <AllArticle />,
      },
      {
        path: "edit-article/:id",
        element: <EditArticle />,
      },
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
