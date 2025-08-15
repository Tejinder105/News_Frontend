import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const getDashboardStats = async () => {
  try {
    const res = await api.get("/api/v1/admin/dashboard/stats");
    return res.data.data;
  } catch (error) {
    console.error("Dashboard stats service error:", error);
    throw error;
  }
};

const getRecentActivities = async (limit = 10) => {
  try {
    const res = await api.get("/api/v1/admin/dashboard/activities", {
      params: { limit },
    });
    console.log("Recent activities response:", res.data);
    return res.data.data;
  } catch (error) {
    console.error("Recent activities service error:", error);
    throw error;
  }
};

const getDashboardData = async (token) => {
  try {
    const res = await api.get("/api/v1/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("Dashboard data service error:", error);
    throw error;
  }
};

// Fetch all articles with admin privileges and enhanced filtering
const getAllArticlesForAdmin = async ({ 
  page = 1, 
  limit = 10, 
  language = "en", 
  status = "all", 
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc",
  token 
} = {}) => {
  try {
    const res = await api.get("/api/v1/admin/articles", {
      params: { page, limit, language, status, search, sortBy, sortOrder },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("Get all articles for admin service error:", error);
    throw error;
  }
};

// Keep the public articles endpoint for backward compatibility
const getAllArticles = async ({ page = 1, limit = 10, language = "en" } = {}) => {
  try {
    const res = await api.get("/api/v1/article/getarticles", {
      params: { page, limit, language },
    });
    return res.data.data;
  } catch (error) {
    console.error("Get all articles service error:", error);
    throw error;
  }
};

// Delete article
const deleteArticle = async (articleId, token) => {
  try {
    const res = await api.delete(`/api/v1/admin/articles/${articleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Delete article service error:", error);
    throw error;
  }
};

// Get article for editing
const getArticleForEdit = async (articleId, token) => {
  try {
    const res = await api.get(`/api/v1/admin/articles/${articleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("Get article for edit service error:", error);
    throw error;
  }
};

// Update article
const updateArticle = async (articleId, formData, token) => {
  try {
    const res = await api.put(`/api/v1/admin/articles/${articleId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Update article service error:", error);
    throw error;
  }
};

export default {
  getDashboardStats,
  getRecentActivities,
  getDashboardData,
  getAllArticles,
  getAllArticlesForAdmin,
  deleteArticle,
  getArticleForEdit,
  updateArticle,
};
