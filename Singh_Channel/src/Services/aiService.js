import api from "./apiClient";

class AiService {
  constructor() {
    this.baseURL = "/api/v1/ai";
    this.getAccessTokenSilently = null; // Will be set by the hook
  }

  /**
   * Set the Auth0 token getter function
   * @param {Function} getAccessTokenSilently - Auth0 token getter function
   */
  setTokenGetter(getAccessTokenSilently) {
    this.getAccessTokenSilently = getAccessTokenSilently;
  }

  /**
   * Handle API errors with user-friendly messages
   * @param {Error} error - The error object
   * @throws {Error} Formatted error
   */
  handleError(error) {
    console.error("AI Service Error:", error);
    
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || "An error occurred with the AI service";
      
      switch (status) {
        case 400:
          throw new Error(`Invalid request: ${message}`);
        case 401:
          throw new Error("Authentication required. Please log in again.");
        case 403:
          throw new Error("Access denied. Admin privileges required.");
        case 429:
          throw new Error("Too many requests. Please wait a moment and try again.");
        case 503:
          throw new Error("AI service is temporarily unavailable. Please try again later.");
        default:
          throw new Error(message);
      }
    } else if (error.request) {
      throw new Error("Network error. Please check your connection and try again.");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }

  /**
   * Get authentication headers using Auth0
   * @returns {Object} Headers with authorization
   */
  async getAuthHeaders() {
    if (!this.getAccessTokenSilently) {
      throw new Error("Authentication not initialized. Please ensure you're logged in.");
    }

    try {
      const token = await this.getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE || import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      if (!token) {
        throw new Error("No authentication token received. Please log in again.");
      }

      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    } catch (error) {
      console.error("Auth0 token error:", error);
      throw new Error("Failed to get authentication token. Please log in again.");
    }
  }

  /**
   * Analyze article content with AI
   * @param {string} content - Content to analyze
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeContent(content) {
    if (!content || content.trim() === "") {
      throw new Error("Content cannot be empty");
    }

    try {
      const headers = await this.getAuthHeaders();
      const response = await api.post(
        `${this.baseURL}/analyze-content`,
        { content },
        { headers }
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Generate headline variations
   * @param {string} content - Content to generate headlines for
   * @param {number} count - Number of variations (default: 5)
   * @returns {Promise<Object>} Headlines object with array
   */
  async generateHeadlines(content, count = 5) {
    if (!content || content.trim() === "") {
      throw new Error("Content cannot be empty");
    }

    if (count < 1 || count > 10) {
      throw new Error("Count must be between 1 and 10");
    }

    try {
      const headers = await this.getAuthHeaders();
      const response = await api.post(
        `${this.baseURL}/generate-headlines`,
        { content, count },
        { headers }
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Translate content to target language
   * @param {Object} articleObject - Article content to translate
   * @param {string} sourceLanguage - Source language code
   * @param {string} targetLanguage - Target language code
   * @returns {Promise<Object>} Translated content
   */
  async translateContent(articleObject, sourceLanguage, targetLanguage) {
    if (!articleObject || typeof articleObject !== 'object') {
      throw new Error("Invalid article object provided");
    }

    if (!sourceLanguage || !targetLanguage) {
      throw new Error("Source and target languages are required");
    }

    if (sourceLanguage === targetLanguage) {
      throw new Error("Source and target languages cannot be the same");
    }

    try {
      const headers = await this.getAuthHeaders();
      const response = await api.post(
        `${this.baseURL}/translate-content`,
        { articleObject, sourceLanguage, targetLanguage },
        { headers }
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Generate tags for content
   * @param {string} content - Content to generate tags for
   * @param {number} maxTags - Maximum number of tags (default: 10)
   * @returns {Promise<Object>} Tags object with array
   */
  async generateTags(content, maxTags = 10) {
    if (!content || content.trim() === "") {
      throw new Error("Content cannot be empty");
    }

    if (maxTags < 1 || maxTags > 20) {
      throw new Error("Max tags must be between 1 and 20");
    }

    try {
      const headers = await this.getAuthHeaders();
      const response = await api.post(
        `${this.baseURL}/generate-tags`,
        { content, maxTags },
        { headers }
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Batch translate content to multiple languages
   * @param {Object} articleObject - Article content to translate
   * @param {string} sourceLanguage - Source language code
   * @param {Array<string>} targetLanguages - Array of target language codes
   * @returns {Promise<Object>} Batch translation results
   */
  async batchTranslate(articleObject, sourceLanguage, targetLanguages) {
    if (!articleObject || typeof articleObject !== 'object') {
      throw new Error("Invalid article object provided");
    }

    if (!sourceLanguage || !Array.isArray(targetLanguages)) {
      throw new Error("Source language and target languages array are required");
    }

    if (targetLanguages.length === 0) {
      throw new Error("At least one target language is required");
    }

    if (targetLanguages.length > 5) {
      throw new Error("Maximum 5 target languages allowed in batch operation");
    }

    try {
      const headers = await this.getAuthHeaders();
      const response = await api.post(
        `${this.baseURL}/batch-translate`,
        { articleObject, sourceLanguage, targetLanguages },
        { headers }
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get AI service status
   * @returns {Promise<Object>} Service status
   */
  async getStatus() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.get(`${this.baseURL}/status`, { headers });

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Check if AI service is available
   * @returns {Promise<boolean>} Service availability
   */
  async isAvailable() {
    try {
      const status = await this.getStatus();
      return status.available;
    } catch (error) {
      console.warn("Could not check AI service status:", error.message);
      return false;
    }
  }
}

// Create singleton instance
const aiService = new AiService();

export { aiService };
