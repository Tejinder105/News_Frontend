import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Lazy Load Layouts
const UserLayout = React.lazy(() => import("./Layouts/UserLayout"));
const AdminLayout = React.lazy(() => import("./Layouts/AdminLayout"));

// Lazy Load User Pages
const Home = React.lazy(() => import("./Pages/Home"));
const NewsArticle = React.lazy(() => import("./Pages/NewsArticle"));
const About = React.lazy(() => import("./Pages/About"));
const Contact = React.lazy(() => import("./Pages/Contact"));
const CategoryPage = React.lazy(() => import("./Pages/CategoryPage"));

// Lazy Load Admin Pages
const Dashboard = React.lazy(() => import("./Pages/Admin/Dashboard"));
const CreateArticle = React.lazy(() => import("./Pages/Admin/CreateArticle"));
const AllArticle = React.lazy(() => import("./Pages/Admin/AllArticle"));
const EditArticle = React.lazy(() => import("./Pages/Admin/EditArticle"));
const Settings = React.lazy(() => import("./Pages/Admin/Settings"));

// Fallback Spinner
import { Spinner } from "./Components";

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <Spinner />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <React.Suspense fallback={<LoadingFallback />}>
        <UserLayout />
      </React.Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <Home />
          </React.Suspense>
        ),
      },
      {
        path: "/article/:id",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <NewsArticle />
          </React.Suspense>
        ),
      },
      {
        path: "/about",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <About />
          </React.Suspense>
        ),
      },
      {
        path: "/contact",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <Contact />
          </React.Suspense>
        ),
      },
      {
        path: "/category/:tag",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <CategoryPage />
          </React.Suspense>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <React.Suspense fallback={<LoadingFallback />}>
        <AdminLayout />
      </React.Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </React.Suspense>
        ),
      },
      {
        path: "createarticles",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <CreateArticle />
          </React.Suspense>
        ),
      },
      {
        path: "allarticles",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <AllArticle />
          </React.Suspense>
        ),
      },
      {
        path: "edit-article/:id",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <EditArticle />
          </React.Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <Settings />
          </React.Suspense>
        ),
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
