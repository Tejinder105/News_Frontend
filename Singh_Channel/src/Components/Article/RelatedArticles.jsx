import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import articleService from "../../Services/articleService";
import Panel from "../Ui/Panel";
import { getOptimizedImageUrl } from "../../Utils/image";

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
      <Panel variant="article" padding={false}>
        <div className="border-b border-gray-100 px-4 py-4">
          <h3 className="font-serif text-lg font-bold text-gray-900">
            Related Stories
          </h3>
        </div>
        <div className="p-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="mb-4 flex gap-3 last:mb-0">
              <div className="h-16 w-24 flex-shrink-0 animate-pulse rounded-md bg-gray-200"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 w-full animate-pulse rounded bg-gray-200"></div>
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  if (error || !relatedArticles || relatedArticles.length === 0) {
    return null;
  }

  return (
    <Panel variant="article" padding={false}>
      <div className="border-b border-gray-100 px-4 py-4">
        <h3 className="font-serif text-lg font-bold text-gray-900">
          Related Stories
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {relatedArticles.map((article) => (
          <Link
            key={article.slug}
            to={`/article/${article.slug}`}
            className="group flex gap-3 p-4 items-start transition-colors hover:bg-gray-50"
          >
            {article.image && (
              <img
                src={getOptimizedImageUrl(article.image, { width: 200 })}
                alt={article.headline}
                className="h-16 w-24 flex-shrink-0 rounded-md object-cover shadow-sm transition-opacity group-hover:opacity-90"
                loading="lazy"
              />
            )}
            <div className="flex flex-col min-w-0">
              <h4 className="-mt-1 line-clamp-3 font-serif text-sm font-medium leading-snug text-gray-900 transition-colors group-hover:text-blue-700">
                {article.headline}
              </h4>
              <p className="mt-1 text-xs text-gray-500">Read more</p>
            </div>
          </Link>
        ))}
      </div>
    </Panel>
  );
};

export default RelatedArticles;
