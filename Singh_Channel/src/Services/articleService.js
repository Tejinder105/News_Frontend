import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const normalizeArticlesResponse = (res) => {
  const payload = res?.data?.data ?? res?.data ?? {};
  const articles = payload?.articles ?? (Array.isArray(payload) ? payload : []);
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
    return normalized;
  } catch (error) {
    throw error;
  }
};

const getArticle = async (identifier, language = "en") => {
  try {
    const res = await api.get(`/api/v1/articles/${identifier}`, {
      params: { language },
    });
    const article = res?.data?.data ?? {};
    return article;
  } catch (error) {
    console.error("Article service error:", error);
    throw error;
  }
};

const getBreakingNews = async (language = "en", limit = 3) => {
  try {
    const res = await api.get(`/api/v1/articles/getbreakingnews`, {
      params: { language, limit },
    });

    const data = res?.data?.data || {};
    return data;
  } catch (error) {
    console.error("Breaking news service error:", error);
    throw error;
  }
};

const getRelatedArticles = async (
  tags,
  language = "en",
  limit = 5,
  excludeSlug = null
) => {
  try {
    const params = {
      tags: JSON.stringify(tags),
      language,
      limit,
    };

    if (excludeSlug) {
      params.excludeSlug = excludeSlug;
    }
    const res = await api.get(`/api/v1/articles/getrelated`, {
      params,
    });

    const articles = res?.data?.data || [];
    return articles;
  } catch (error) {
    console.error("Related articles service error:", error);
    throw error;
  }
};

export default {
  getAllArticles,
  getArticle,
  getBreakingNews,
  getRelatedArticles,
};
