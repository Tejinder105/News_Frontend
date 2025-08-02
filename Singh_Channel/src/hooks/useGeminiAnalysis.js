import { useState, useCallback } from "react";
import { geminiService } from "../Services/geminiService";
import { set } from "react-hook-form";

function useGeminiAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const analyzeContent = useCallback(async (content) => {
    if (!geminiService.isAvailable()) {
      setError("Gemini service is not available. Please check your API key.");
      return null;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await geminiService.analyzeArticleContent(content);
      setAnalysis(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const generateHeadlines = useCallback(async (content, count = 5) => {
    if (!geminiService.isAvailable()) {
      setError("Gemini service is not available");
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await geminiService.generateHeadlineVariations(
        content,
        count
      );
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const translateContent = useCallback(
    async (content, sourceLanguage, targetLanguage) => {
      if (!geminiService.isAvailable()) {
        setError("Gemini service is not available");
        return null;
      }

      setIsAnalyzing(true);
      setError(null);

      try {
        const result = await geminiService.translateContent(
          content, 
          sourceLanguage,
          targetLanguage
        );
        return result;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  const generateTags = useCallback(async (content, maxTags = 10) => {
    if (!geminiService.isAvailable()) {
      setError("Gemini service is not available");
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await geminiService.generateTags(content, maxTags);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    analysis,
    error,
    analyzeContent,
    generateHeadlines,
    translateContent,
    generateTags,
    clearAnalysis,
    isAvailable: geminiService.isAvailable(),
  };
}

export default useGeminiAnalysis;
