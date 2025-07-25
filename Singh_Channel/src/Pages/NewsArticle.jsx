import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ArticleHeader from "../Components/Article/ArticleHeader";
import ArticleContent from "../Components/Article/ArticleContent";
import SkeletonArticle from "../Components/Article/SkeletonArticle";
import ResourceNotFound from "../Components/Ui/ResourceNotFound";

import CardAd from "../Components/Ui/CardAd";
import { newsItem } from "../NewItem.js";
import { adItem } from "../AdItem.jsx";

function NewsArtilcle() {
  const { id } = useParams();
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    else if (diffInHours < 24) return `${diffInHours} hours ago`;
    else if (diffInHours < 48) return 'Yesterday';
    else if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`/Articles/${id}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("File not found");
        return res.json();
      })
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const relatedArticles = useMemo(() => {
    return newsItem.filter((item) => item.id !== id);
  }, [id]);

  if (loading) return <SkeletonArticle />;
  if (error) return <ResourceNotFound />;

  return (
  <div className="grid min-h-screen grid-cols-1 gap-4 bg-slate-100 p-4 md:grid-cols-12">
    {/* Related News - Left on Desktop, Second on Mobile */}
    <div className="order-2 md:order-1 md:col-span-3">
      <div className="space-y-6">
        <div className="rounded-md border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900">Related News</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {relatedArticles.slice(0, 5).map((news, index) => (
              <div
                key={news.id || index}
                className="cursor-pointer px-4 py-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex gap-3">
                  <div>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-sm text-white">
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="line-clamp-3 text-sm font-medium leading-tight text-gray-900">
                      {news.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatTime(news.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Main Article Content - Centered on Desktop, First on Mobile */}
    <div className="order-1 md:order-2 md:col-span-6">
      <div className="rounded-md bg-white">
        <ArticleHeader
          title={content.headline}
          author={content.by}
          publishedTime={content.uploaded_Time}
          category={content.category || "News"}
          imageUrl={content.image}
          summary={content.summary}
        />
        <ArticleContent content={content.content} />
      </div>
    </div>

    {/* Ads - Right on Desktop, Last on Mobile */}
    <div className="order-3 md:order-3 md:col-span-3">
      <div className="grid grid-cols-1 gap-4">
        {adItem.map((ad, idx) => (
          <CardAd key={idx} data={ad} />
        ))}
      </div>
    </div>
  </div>
);
}

export default NewsArtilcle;
