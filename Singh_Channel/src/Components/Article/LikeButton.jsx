import React, { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import likeService from "../../Services/likeService";

const LikeButton = ({ articleId }) => {
    const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } =
        useAuth0();
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                let token = null;
                if (isAuthenticated) {
                    token = await getAccessTokenSilently();
                }
                const data = await likeService.getLikes(articleId, token);
                if (data && data.data) {
                    setCount(data.data.count);
                    setLiked(data.data.isLiked);
                }
            } catch (error) {
                console.error("Error fetching likes:", error);
            }
        };

        fetchLikes();
    }, [articleId, isAuthenticated, getAccessTokenSilently]);

    const handleLike = async () => {
        if (!isAuthenticated) {
            await loginWithRedirect({
                appState: { returnTo: window.location.pathname },
            });
            return;
        }

        if (loading) return;

        // Optimistic update
        const previousLiked = liked;
        const previousCount = count;
        setLiked(!liked);
        setCount(liked ? count - 1 : count + 1);
        setLoading(true);

        try {
            const token = await getAccessTokenSilently();
            await likeService.toggleLike(articleId, token);
        } catch (error) {
            console.error("Error toggling like:", error);
            // Revert on error
            setLiked(previousLiked);
            setCount(previousCount);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${liked
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
            disabled={loading}
        >
            <ThumbsUp
                size={20}
                className={`transition-all duration-300 ${liked ? "fill-current scale-110" : "scale-100"
                    }`}
            />
            <span className="font-medium">{count}</span>
        </button>
    );
};

export default LikeButton;
