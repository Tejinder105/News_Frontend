import { useState, useEffect } from "react";
import adminService from "../Services/adminService";
import { adItem } from "../AdItem"; // Fallback static ads

/**
 * Hook to fetch active advertisements from the backend
 * Falls back to static ads if the backend is unavailable
 */
export const useAdvertisements = (placement = "sidebar") => {
    const [advertisements, setAdvertisements] = useState(adItem); // Default to static
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                setLoading(true);
                const data = await adminService.getActiveAdvertisements(placement);
                
                // If we have ads from the backend, use them; otherwise keep static
                if (data && data.length > 0) {
                    setAdvertisements(data);
                }
                setError(null);
            } catch (err) {
                console.error("Failed to fetch advertisements:", err);
                setError(err);
                // Keep using static ads on error
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, [placement]);

    return { advertisements, loading, error };
};

export default useAdvertisements;
