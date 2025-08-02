import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ArticleService {
  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Add authorization header for protected routes
  setAuthHeader(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // Get all articles with optional filters
  async getArticles(params = {}) {
    try {
      const response = await this.client.get('/articles', { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get a single article by ID or slug
  async getArticle(identifier) {
    try {
      const response = await this.client.get(`/articles/${identifier}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Create a new article
  async createArticle(articleData) {
    try {
      const response = await this.client.post('/articles', articleData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update an existing article
  async updateArticle(id, articleData) {
    try {
      const response = await this.client.put(`/articles/${id}`, articleData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Delete an article
  async deleteArticle(id) {
    try {
      const response = await this.client.delete(`/articles/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Upload article image
  async uploadImage(file, articleId = null) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (articleId) formData.append('articleId', articleId);
      
      const response = await this.client.post('/uploads/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Error handling
  handleError(error) {
    const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
    console.error('Article service error:', error);
    throw new Error(errorMessage);
  }
}

export default new ArticleService();