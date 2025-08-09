import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ArticleHeader from "../Components/Article/ArticleHeader";
import ArticleContent from "../Components/Article/ArticleContent";
import SkeletonArticle from "../Components/Article/SkeletonArticle";
import ResourceNotFound from "../Components/Ui/ResourceNotFound";
import { ReadingProgress } from "../Components/Article/ArticleAnimations";

import CardAd from "../Components/Ui/CardAd";
import { newsItem } from "../NewItem.js";
import { adItem } from "../AdItem.jsx";
import articleService from "../Services/articleService";

function NewsArtilcle() {
  const { id } = useParams();
  const language = useSelector((s) => s.language.current);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    else if (diffInHours < 24) return `${diffInHours} hours ago`;
    else if (diffInHours < 48) return "Yesterday";
    else if (diffInHours < 168)
      return `${Math.floor(diffInHours / 24)} days ago`;
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    setLoading(true);
    setError(false);

    articleService
      .getArticle(id, language)
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => {
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
      });
  }, [id, language]);

  const relatedArticles = useMemo(() => {
    return newsItem.filter((item) => item.id !== id);
  }, [id]);

  const calculateReadTime = (text) => {
    if (!text || typeof text !== "string") return "0 min read";
    const wordsPerMinute = 200;
    const noOfWords = text.replace(/<[^>]*>/g, "").split(/\s/g).length;
    const minutes = Math.ceil(noOfWords / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) return <SkeletonArticle />;
  if (error) return <ResourceNotFound />;

  return (
    <>
      <ReadingProgress />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-5 lg:px-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
            <aside className="order-1 hidden lg:col-span-3 lg:block">
              <div className="sticky top-6 space-y-4">
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-3">
                    <h3 className="flex items-center text-lg font-semibold text-white">
                      Related Stories
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {relatedArticles.slice(0, 5).map((news, index) => (
                      <div
                        key={news.id || index}
                        className="group cursor-pointer px-3 py-4 transition-all duration-200 hover:bg-blue-50"
                      >
                        <div className="flex gap-2">
                          <div className="flex-shrink-0">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="line-clamp-3 text-sm leading-tight font-medium text-gray-900 transition-colors group-hover:text-blue-700">
                              {news.title}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Article Content */}
            <main className="order-1 lg:order-2 lg:col-span-6">
              <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <ArticleHeader
                  title={content.headline}
                  author={content.author}
                  publishedTime={content.publishedAt}
                  imageUrl={content.image}
                  summary={content.summary || content.description}
                  readTime={calculateReadTime(content.content)}
                />
                <ArticleContent
                  content={content.content}
                  title={content.headline}
                  author={content.author}
                />
              </article>

              {/* Mobile Related Articles */}
              <div className="mt-8 lg:hidden">
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-4">
                    <h3 className="text-lg font-semibold text-white">
                      Related Stories
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {relatedArticles.slice(0, 3).map((news, index) => (
                      <div
                        key={news.id || index}
                        className="cursor-pointer px-3 py-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex gap-3">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h4 className="line-clamp-2 text-sm font-medium text-gray-900">
                              {news.title}
                            </h4>
                            <p className="mt-1 text-xs text-gray-500">
                              {formatTime(news.publishedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>

            {/* Right Sidebar */}
            <aside className="order-3 lg:col-span-3">
              <div className="sticky top-6 space-y-3">
                {/* Advertisement Section */}
                <div className="text-center">
                  <p className="mb-4 text-xs tracking-wider text-gray-500 uppercase">
                    Advertisement
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {adItem.slice(0, 4).map((ad, idx) => (
                    <div
                      key={idx}
                      className="transform transition-transform hover:scale-105"
                    >
                      <CardAd data={ad} />
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewsArtilcle;
