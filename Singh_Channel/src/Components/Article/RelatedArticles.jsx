import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Tag, Eye } from 'lucide-react';
import articleService from '../../Services/articleService';

const RelatedArticles = ({ tags, currentArticleId, language = "en", limit = 5 }) => {
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
        console.log('Fetching related articles for tags:', tags, 'excluding:', currentArticleId);
        
        const articles = await articleService.getRelatedArticles(
          tags, 
          language, 
          limit, 
          currentArticleId
        );
        setRelatedArticles(articles || []);
      } catch (err) {
        console.error('Error fetching related articles:', err);
        setError('Failed to load related articles');
        setRelatedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedArticles();
  }, [tags, currentArticleId, language, limit]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    else if (diffInHours < 24) return `${diffInHours}h ago`;
    else if (diffInHours < 48) return "1d ago";
    else if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

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
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
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
        <div className="p-4 text-center text-gray-500 text-sm">
          {error}
        </div>
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
        <div className="p-4 text-center text-gray-500 text-sm">
          No related articles found
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
        <h3 className="flex items-center text-lg font-semibold text-white">
          <Tag className="mr-2 h-5 w-5" />
          Related Stories
          <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
            {relatedArticles.length}
          </span>
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {relatedArticles.map((article, index) => (
          <Link
            key={article._id || index}
            to={`/article/${article.slug || article._id}`}
            className="group block cursor-pointer px-4 py-4 transition-all duration-200 hover:bg-blue-50"
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-sm">
                  {index + 1}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="line-clamp-2 text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-700 leading-tight mb-2">
                  {article.headline || 'Untitled Article'}
                </h4>
                
                {article.summary && (
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {truncateText(article.summary)}
                  </p>
                )}
                
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(article.publishedAt)}</span>
                  </div>
                  
                  {article.views && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{article.views} views</span>
                    </div>
                  )}
                  
                  {article.tagMatchCount > 1 && (
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>{article.tagMatchCount} tags match</span>
                    </div>
                  )}
                </div>

                {article.isfeatured && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {relatedArticles.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            Found {relatedArticles.length} article{relatedArticles.length !== 1 ? 's' : ''} with similar tags
          </p>
        </div>
      )}
    </div>
  );
};

export default RelatedArticles;
