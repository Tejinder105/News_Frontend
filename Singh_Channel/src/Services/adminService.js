import api from "./apiClient";

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

// Settings
const getSettings = async () => {
  try {
    const res = await api.get("/api/v1/settings");
    return res.data.data;
  } catch (error) {
    console.error("Get settings service error:", error);
    throw error;
  }
};

const updateSettings = async (data, token) => {
  try {
    const res = await api.put("/api/v1/settings", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Update settings service error:", error);
    throw error;
  }
};


const updateUserRoleByEmail = async (email, role, token) => {
  try {
    const res = await api.put(`/api/v1/users/role/by-email`, { email, role }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data;
  } catch (error) {
    console.error("Update user role by email service error:", error);
    throw error;
  }
};

export default {
  getDashboardStats,
  getRecentActivities,
  getDashboardData,
  getAllArticlesForAdmin,
  deleteArticle,
  getArticleForEdit,
  updateArticle,
  getSettings,
  updateSettings,
  updateUserRoleByEmail
};
