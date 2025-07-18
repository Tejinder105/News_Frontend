import { GoogleGenAI } from "@google/genai";

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.genAI = null;
    this.initializeService();
  }

  initializeService() {
    if (!this.apiKey) {
      console.warn("Gemini API key not found. Please set VITE_GEMINI_API_KEY");
      return;
    }

    try {
      this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
      console.log("Gemini service initialized successfully!");
    } catch (error) {
      console.error("Failed to initialize Gemini service:", error);
    }
  }

  async analyzeArticleContent(content) {
    this.ensureService();

    if (!content || content.trim() === "") {
      throw new Error("Content cannot be empty");
    }

    const prompt = `
      Analyze the following content and provide suggestions for a news article:

      Content: "${content}"

      Please provide your response in the following JSON format:
      {
        "headline": "A compelling, SEO-friendly headline (max 60 characters)",
        "summary": "A brief, engaging summary (2-3 sentences, max 160 characters)",
        "refinedContent": "An improved, well-structured version of the content with better grammar and flow",
        "PunjabiTranslation": "Complete Punjabi translation of the original content",
        "tags": ["relevant", "seo", "tags", "maximum", "7", "tags", "here"],
        "seoScore": 85,
        "readabilityScore": 78,
        "suggestions": [
          "Specific improvement suggestion 1",
          "Specific improvement suggestion 2"
        ]
      }
    `;

    try {
      const response = await this.genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text = response.text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Failed to parse AI response");

      const parsedResponse = JSON.parse(jsonMatch[0]);
      this.validateResponse(parsedResponse);
      return parsedResponse;
    } catch (error) {
      console.error("Error analyzing content:", error);
      throw new Error(`Failed to analyze content: ${error.message}`);
    }
  }

  async generateHeadlineVariations(content, count = 5) {
    this.ensureService();

    const prompt = `
      Generate ${count} different headline variations for this content:
      "${content}"

      Return as JSON array:
      {
        "headlines": [
          "Headline variation 1",
          "Headline variation 2",
          "Headline variation 3"
        ]
      }

      Make them diverse in style (news, clickbait, professional, emotional, etc.)
    `;

    try {
      const response = await this.genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text = response.text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) throw new Error("Failed to parse headline variations");

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      throw new Error(`Failed to generate headlines: ${error.message}`);
    }
  }

  async translateContent(articleObject, targetLanguage) {
    this.ensureService();

    const prompt = `
    Translate the following article object to ${targetLanguage}. 
    Maintain the original meaning, tone, structure, and ALL HTML formatting exactly as provided.
    
    IMPORTANT REQUIREMENTS:
    - Keep ALL HTML tags intact (including <p>, <strong>, <h1>, etc.)
    - Preserve exact formatting and structure
    - Only translate the text content, not HTML tags
    - Maintain the same object structure in response
    - Detect the original language of the content
    
    Article to translate:
    ${JSON.stringify(articleObject, null, 2)}
    
    Return the response as a valid JSON object with this exact structure:
    {
      "headline": "translated headline here",
      "summary": "translated summary here", 
      "content": "translated content with preserved HTML formatting",
      "originalLanguage": "detected language code (e.g., en, hi, es)",
      "targetLanguage": "${targetLanguage}"
    }
    
    Ensure the response is valid JSON that can be parsed directly.
  `;

    try {
      const response = await this.genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text = response.text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) throw new Error("Failed to parse translation");

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      throw new Error(`Failed to translate content: ${error.message}`);
    }
  }

  async generateTags(content, maxTags = 10) {
    this.ensureService();

    const prompt = `
      Generate relevant tags for this content (max ${maxTags}):
      "${content}"

      Return as JSON:
      {
        "tags": ["tag1", "tag2", "tag3"],
        "categories": ["category1", "category2"]
      }

      Focus on SEO-friendly, relevant tags that would help with discoverability.
    `;

    try {
      const response = await this.genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text = response.text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) throw new Error("Failed to parse tags");

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      throw new Error(`Failed to generate tags: ${error.message}`);
    }
  }

  validateResponse(response) {
    const requiredFields = [
      "headline",
      "summary",
      "refinedContent",
      "PunjabiTranslation",
      "tags",
    ];
    for (const field of requiredFields) {
      if (!response[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!Array.isArray(response.tags)) {
      throw new Error("Tags should be an array");
    }
  }

  ensureService() {
    if (!this.genAI) {
      throw new Error("Gemini service not initialized");
    }
  }

  isAvailable() {
    return !!this.genAI;
  }
}

export const geminiService = new GeminiService();
