import axios from "axios";

// Use a base axios instance so the host is consistent on mobile
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

const normalizeArticlesResponse = (res) => {
    // Backend returns ApiResponse { statusCode, data, message, success? }
    const payload = res?.data?.data ?? res?.data ?? {};
    const articles =
        payload?.articles ?? (Array.isArray(payload) ? payload : []);
    const pagination = payload?.pagination ?? {};
    return { articles, pagination };
};

const getAllArticles = async (
    language = "en",
    page = 1,
    limit = 20,
    signal
) => {
    try {
        const res = await api.get(`/api/v1/articles/getarticles`, {
            params: { language, page, limit },
            signal,
        });
        const normalized = normalizeArticlesResponse(res);
        console.log("Fetched articles (normalized):", normalized);
        return normalized;
    } catch (error) {
        console.error("Article service error:", error);
        throw error;
    }
};

const getArticle = async (identifier, language = "en") => {
    try {
        const res = await api.get(`/api/v1/articles/${identifier}`, {
            params: { language },
        });
        // Backend returns ApiResponse { statusCode, data, message, success? }
        const article = res?.data?.data ?? res?.data ?? {};
        console.log("Fetched single article:", article);
        return article;
    } catch (error) {
        console.error("Article service error:", error);
        throw error;
    }
};

export default { getAllArticles, getArticle };
