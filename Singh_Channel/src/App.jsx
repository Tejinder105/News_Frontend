import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "./Components";

// Lazy Load Layouts
const UserLayout = React.lazy(() => import("./Layouts/UserLayout"));
const AdminLayout = React.lazy(() => import("./Layouts/AdminLayout"));

// Lazy Load User Pages
const Home = React.lazy(() => import("./Pages/Home"));
const NewsArticle = React.lazy(() => import("./Pages/NewsArticle"));
const About = React.lazy(() => import("./Pages/About"));
const Contact = React.lazy(() => import("./Pages/Contact"));
const CategoryPage = React.lazy(() => import("./Pages/CategoryPage"));
const LocationPage = React.lazy(() => import("./Pages/LocationPage"));

// Lazy Load Admin Pages
const Dashboard = React.lazy(() => import("./Pages/Admin/Dashboard"));
const CreateArticle = React.lazy(() => import("./Pages/Admin/CreateArticle"));
const AllArticle = React.lazy(() => import("./Pages/Admin/AllArticle"));
const EditArticle = React.lazy(() => import("./Pages/Admin/EditArticle"));
const Settings = React.lazy(() => import("./Pages/Admin/Settings"));

// Lazy Load NotFound Page
const NotFound = React.lazy(() => import("./Pages/NotFound"));

// Fallback Spinner & Protected Route
import { Spinner, ProtectedRoute } from "./Components";

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
    errorElement: (
      <React.Suspense fallback={<LoadingFallback />}>
        <NotFound />
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
      {
        path: "/location/:location",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <LocationPage />
          </React.Suspense>
        ),
      },
      /* 404 Route for User Layout */
      {
        path: "*",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </React.Suspense>
        )
      }
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<LoadingFallback />}>
          <AdminLayout />
        </React.Suspense>
      </ProtectedRoute>
    ),
    errorElement: (
      <React.Suspense fallback={<LoadingFallback />}>
        <NotFound />
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
      /* 404 Route for Admin Layout */
      {
        path: "*",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </React.Suspense>
        )
      }
    ],
  },
  // Catch-all for top-level routes that don't match / or /admin
  {
    path: "*",
    element: (
      <React.Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </React.Suspense>
    ),
  }
]);

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
