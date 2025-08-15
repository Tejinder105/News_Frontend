import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ArticleHeader from "../Components/Article/ArticleHeader";
import ArticleContent from "../Components/Article/ArticleContent";
import SkeletonArticle from "../Components/Article/SkeletonArticle";
import ResourceNotFound from "../Components/Ui/ResourceNotFound";
import RelatedArticles from "../Components/Article/RelatedArticles";
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
                <RelatedArticles 
                  tags={content.tags || []} 
                  currentArticleId={content._id} 
                  language={language} 
                  limit={5} 
                />
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
                  youtubeLink={content.youtube_link}
                />
              </article>

              {/* Mobile Related Articles */}
              <div className="mt-8 lg:hidden">
                <RelatedArticles 
                  tags={content.tags || []} 
                  currentArticleId={content._id} 
                  language={language} 
                  limit={3} 
                />
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
