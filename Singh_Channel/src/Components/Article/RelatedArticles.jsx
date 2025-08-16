import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import articleService from "../../Services/articleService";

const RelatedArticles = ({
  tags,
  currentArticleSlug,
  language = "en",
  limit = 5,
}) => {
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      if (!tags || !Array.isArray(tags) || tags.length === 0) {
        setLoading(false);
        setRelatedArticles([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const articles = await articleService.getRelatedArticles(
          tags,
          language,
          limit,
          currentArticleSlug
        );
        setRelatedArticles(articles || []);
      } catch (err) {
        console.error("Error fetching related articles:", err);
        setError("Failed to load related articles");
        setRelatedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedArticles();
  }, [tags, currentArticleSlug, language, limit]);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
          <h3 className="flex items-center text-lg font-semibold text-white">
            <Tag className="mr-2 h-5 w-5" />
            Related Stories
          </h3>
        </div>
        <div className="p-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="animate-pulse space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                <div className="h-3 w-full rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
          <h3 className="flex items-center text-lg font-semibold text-white">
            <Tag className="mr-2 h-5 w-5" />
            Related Stories
          </h3>
        </div>
        <div className="p-4 text-center text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  if (!relatedArticles || relatedArticles.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
          <h3 className="flex items-center text-lg font-semibold text-white">
            <Tag className="mr-2 h-5 w-5" />
            Related Stories
          </h3>
        </div>
        <div className="p-4 text-center text-sm text-gray-500">
          No related articles found
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5">
        <h3 className="flex items-center text-base font-semibold text-white">
          <Tag className="mr-2 h-4 w-4" />
          Related Stories
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {relatedArticles.map((article, index) => (
          <Link
            key={article.slug}
            to={`/article/${article.slug}`}
            className="group block cursor-pointer px-4 py-3 transition-all duration-200 hover:bg-blue-50"
          >
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white shadow-sm">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-sm leading-tight font-medium text-gray-900 transition-colors group-hover:text-blue-700">
                    {article.headline}
                  </h4>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
