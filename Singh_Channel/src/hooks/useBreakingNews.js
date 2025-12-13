import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setBreakingNews, setError, clearBreakingNews } from "../Services/Store/breakingNewsSlice";
import articleService from "../Services/articleService";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useBreakingNews = () => {
  const dispatch = useDispatch();
  const { breakingNews, loading, error, lastFetched } = useSelector((state) => state.breakingNews);
  const language = useSelector((state) => state.language.current);

  const isCacheValid = useCallback(() => {
    if (!lastFetched) return false;
    return Date.now() - lastFetched < CACHE_DURATION;
  }, [lastFetched]);

  const fetchBreakingNews = useCallback(async (forceRefresh = false) => {
    // Skip if cache is valid and not forcing refresh
    if (!forceRefresh && isCacheValid() && breakingNews.length > 0) {
      return;
    }

    try {
      dispatch(setLoading(true));

      // Fetch all articles and filter for breaking news
      // This ensures consistency with Home.jsx and provides full article objects
      const { articles } = await articleService.getAllArticles(language, 1, 50);
      const breaking = Array.isArray(articles)
        ? articles.filter((article) => article?.isBreaking)
        : [];

      dispatch(setBreakingNews(breaking));
    } catch (err) {
      console.error("Error fetching breaking news:", err);
      dispatch(setError("Failed to load breaking news"));
    }
  }, [dispatch, language, isCacheValid, breakingNews.length]);

  const refreshBreakingNews = useCallback(() => {
    return fetchBreakingNews(true);
  }, [fetchBreakingNews]);

  const clearCache = useCallback(() => {
    dispatch(clearBreakingNews());
  }, [dispatch]);

  // Auto-fetch on language change or mount
  useEffect(() => {
    fetchBreakingNews();
  }, [fetchBreakingNews]);

  // Clear cache when language changes
  useEffect(() => {
    clearCache();
  }, [language, clearCache]);

  return {
    breakingNews,
    loading,
    error,
    refreshBreakingNews,
    isStale: !isCacheValid(),
  };
};
