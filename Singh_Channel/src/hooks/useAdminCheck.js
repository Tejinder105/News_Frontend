import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../Services/apiClient";

/**
 * Custom hook to check if the current user has admin role
 * Eliminates duplicate admin check logic across components
 */
export const useAdminCheck = () => {
    const { isAuthenticated, user, getAccessTokenSilently, isLoading } = useAuth0();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!isAuthenticated || !user) {
                setIsAdmin(false);
                setIsCheckingAdmin(false);
                return;
            }

            try {
                setIsCheckingAdmin(true);
                const token = await getAccessTokenSilently();

                const response = await api.get("/api/v1/users/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const profile = response.data;
                const hasAdminRole = profile.user.roles?.some(
                    (role) => role.toLowerCase() === "admin"
                );
                setIsAdmin(hasAdminRole);
            } catch (error) {
                console.error("Error fetching user profile for admin check:", error);
                setIsAdmin(false);
            } finally {
                setIsCheckingAdmin(false);
            }
        };

        fetchUserProfile();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    return {
        isAdmin,
        isCheckingAdmin: isLoading || isCheckingAdmin,
        isAuthenticated,
        user
    };
};

export default useAdminCheck;
