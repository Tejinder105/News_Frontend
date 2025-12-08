import apiClient from "./apiClient";

const commentService = {
    addComment: async (articleId, content, userName, userImage, token) => {
        const response = await apiClient.post(
            `/api/v1/comments/${articleId}`,
            { content, userName, userImage },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    },

    getComments: async (articleId, page = 1) => {
        const response = await apiClient.get(
            `/api/v1/comments/${articleId}?page=${page}`
        );
        return response.data;
    },

    deleteComment: async (commentId, token) => {
        const response = await apiClient.delete(`/api/v1/comments/${commentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
};

export default commentService;
