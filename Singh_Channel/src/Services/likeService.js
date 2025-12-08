import apiClient from "./apiClient";

const likeService = {
    toggleLike: async (articleId, token) => {
        const response = await apiClient.post(
            `/api/v1/likes/${articleId}/toggle`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    },

    getLikes: async (articleId, token = null) => {
        const config = {};
        if (token) {
            config.headers = {
                Authorization: `Bearer ${token}`,
            };
        }
        const response = await apiClient.get(`/api/v1/likes/${articleId}`, config);
        return response.data;
    },
};

export default likeService;
