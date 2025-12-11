import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../Services/apiClient";
import { Spinner } from "./index";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(null);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isLoading) {
        return;
      }

      if (!isAuthenticated) {
        setChecking(false);
        return;
      }

      try {
        const token = await getAccessTokenSilently();
        const response = await api.get("/api/v1/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = response.data;
        const adminStatus = profile.user.roles?.some(
          (role) => role.toLowerCase() === "admin"
        );
        
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, isLoading, user, getAccessTokenSilently]);

  // Show loading spinner while checking authentication
  if (isLoading || checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    loginWithRedirect({
      appState: { returnTo: location.pathname }
    });
    return null;
  }

  // Show access denied if not admin
  if (isAdmin === false) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mb-4 flex justify-center">
            <svg
              className="h-16 w-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-800">Access Denied</h1>
          <p className="mb-6 text-gray-600">
            You don't have permission to access the admin panel. This area is restricted to administrators only.
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  // Render children if admin
  return children;
};

export default ProtectedRoute;
