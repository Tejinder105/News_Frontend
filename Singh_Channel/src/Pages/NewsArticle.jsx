import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArticleHeader,
  ArticleContent,
  SkeletonArticle,
  RelatedArticles,
  ResourceNotFound,
  ReadingProgress,
  CardAd,
  Panel,
  CommentSection,
} from "../Components";
import { adItem } from "../AdItem.jsx";
import articleService from "../Services/articleService";

function NewsArticle() {
  const { id } = useParams();
  const language = useSelector((s) => s.language.current);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    articleService
      .getArticle(id, language)
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching article:", err);
        setError(true);
        setLoading(false);
      });
  }, [id, language]);

  const calculateReadTime = (text) => {
    if (!text || typeof text !== "string") return "0 min read";
    const wordsPerMinute = 150;
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
                  currentArticleSlug={content.slug}
                  language={language}
                  limit={5}
                />
              </div>
            </aside>

            {/* Main Article Content */}
            <main className="order-1 lg:order-2 lg:col-span-6">
              <Panel variant="article" className="article">
                <ArticleHeader
                  title={content.headline}
                  author={content.author}
                  publishedTime={content.publishedAt}
                  imageUrl={content.image}
                  summary={content.summary || content.description}
                  readTime={calculateReadTime(content.content)}
                  articleId={content._id}
                />
                <ArticleContent
                  content={content.content}
                  title={content.headline}
                  author={content.author}
                  youtubeLink={content.youtube_link}
                />
                <CommentSection articleId={content._id} />
              </Panel>

              <div className="mt-4 lg:hidden">
                <RelatedArticles
                  tags={content.tags || []}
                  currentArticleSlug={content.slug}
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

export default NewsArticle;
