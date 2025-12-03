import { useState, useCallback, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { aiService } from "../Services/aiService";

function useAiAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

  // Initialize the AI service with Auth0 token getter
  useEffect(() => {
    if (isAuthenticated && getAccessTokenSilently) {
      aiService.setTokenGetter(getAccessTokenSilently);
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  // Helper function to check authentication
  const checkAuth = useCallback(() => {
    if (isLoading) {
      setError("Authentication is loading. Please wait...");
      return false;
    }
    
    if (!isAuthenticated) {
      setError("You must be logged in to use AI features.");
      return false;
    }
    
    return true;
  }, [isAuthenticated, isLoading]);

  const analyzeContent = useCallback(async (content) => {
    if (!checkAuth()) return null;

    try {
      const isAvailable = await aiService.isAvailable();
      if (!isAvailable) {
        setError("AI service is not available. Please check your connection or try again later.");
        return null;
      }
    } catch (err) {
      setError("Unable to connect to AI service. Please try again later.");
      return null;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await aiService.analyzeContent(content);
      setAnalysis(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [checkAuth]);

  const generateHeadlines = useCallback(async (content, count = 5) => {
    if (!checkAuth()) return null;

    try {
      const isAvailable = await aiService.isAvailable();
      if (!isAvailable) {
        setError("AI service is not available");
        return null;
      }
    } catch (err) {
      setError("Unable to connect to AI service");
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await aiService.generateHeadlines(content, count);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [checkAuth]);

  const translateContent = useCallback(
    async (content, sourceLanguage, targetLanguage) => {
      if (!checkAuth()) return null;

      try {
        const isAvailable = await aiService.isAvailable();
        if (!isAvailable) {
          setError("AI service is not available");
          return null;
        }
      } catch (err) {
        setError("Unable to connect to AI service");
        return null;
      }

      setIsAnalyzing(true);
      setError(null);

      try {
        const result = await aiService.translateContent(
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
    [checkAuth]
  );

  const generateTags = useCallback(async (content, maxTags = 10) => {
    if (!checkAuth()) return null;

    try {
      const isAvailable = await aiService.isAvailable();
      if (!isAvailable) {
        setError("AI service is not available");
        return null;
      }
    } catch (err) {
      setError("Unable to connect to AI service");
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await aiService.generateTags(content, maxTags);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [checkAuth]);

  const batchTranslate = useCallback(
    async (articleObject, sourceLanguage, targetLanguages) => {
      if (!checkAuth()) return null;

      try {
        const isAvailable = await aiService.isAvailable();
        if (!isAvailable) {
          setError("AI service is not available");
          return null;
        }
      } catch (err) {
        setError("Unable to connect to AI service");
        return null;
      }

      setIsAnalyzing(true);
      setError(null);

      try {
        const result = await aiService.batchTranslate(
          articleObject,
          sourceLanguage,
          targetLanguages
        );
        return result;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [checkAuth]
  );

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  const checkServiceStatus = useCallback(async () => {
    if (!checkAuth()) return null;

    try {
      const status = await aiService.getStatus();
      return status;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [checkAuth]);

  // Check if AI service is available (async version)
  const isAvailable = useCallback(async () => {
    if (!isAuthenticated) return false;
    
    try {
      return await aiService.isAvailable();
    } catch (error) {
      console.warn("Could not check AI service availability:", error.message);
      return false;
    }
  }, [isAuthenticated]);

  return {
    isAnalyzing,
    analysis,
    error,
    analyzeContent,
    generateHeadlines,
    translateContent,
    generateTags,
    batchTranslate,
    clearAnalysis,
    checkServiceStatus,
    isAvailable,
    isAuthenticated,
    isAuthLoading: isLoading,
  };
}

export default useAiAnalysis;
