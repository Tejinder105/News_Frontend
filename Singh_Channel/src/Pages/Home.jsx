import React, { useEffect, useState } from "react";
import { Carousel, Weather, CardAd, Card, Spinner, Button, SectionHeading } from "../Components";
import articleService from "../Services/articleService";
import { useSelector } from "react-redux";
import { adItem } from "../AdItem.jsx";

function Home() {
  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const language = useSelector((s) => s.language.current);
  
  // Use breaking news from shared state instead of filtering locally
  const breakingNews = useSelector((state) => state.breakingNews.breakingNews);

  useEffect(() => {
    const controller = new AbortController();
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const { articles } = await articleService.getAllArticles(
          language,
          1,
          20,
          controller.signal
        );
        setArticle(Array.isArray(articles) ? articles : []);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again later.");
        setArticle([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
    return () => controller.abort();
  }, [language]);

  const featuredNews = Array.isArray(article)
    ? article.filter((item) => item?.isfeatured)
    : [];

  const displayFeaturedNews = featuredNews.length > 0 
    ? featuredNews 
    : Array.isArray(article) 
      ? article.slice(0, 3)
      : [];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div>
            <Spinner size="large" color="blue-500" />
          </div>
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <p className="mb-4 text-red-500">{error}</p>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl bg-slate-100 px-2 py-3 sm:px-4 lg:px-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="space-y-4 md:col-span-2 lg:col-span-3">
          <Carousel items={displayFeaturedNews} />

          {breakingNews.length > 0 && (
            <div className="mb-8">
              <div className="mb-4">
                <SectionHeading title="Breaking News" color="red" animated />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {breakingNews.slice(0, 3).map((item) => (
                  <Card key={item.slug} article={item} />
                ))}
              </div>
            </div>
          )}

          
          <div className="mb-8">
            <div className="mb-4">
              <SectionHeading title="Latest News" color="blue" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.isArray(article) &&
                article
                  .filter((item) => !item.isBreaking)
                  .map((item) => (
                    <Card
                      key={item.slug}
                      article={item}
                    />
                  ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:col-span-1">
          <Weather />
          <div>
            <h2 className="mb-4 border-b-2 border-slate-200 pb-3 text-lg font-bold text-gray-800 sm:text-xl lg:text-2xl dark:border-slate-700 dark:text-gray-100">
              <span className="inline-block text-blue-600">Advertisements</span>
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1">
              {adItem.map((ad, idx) => (
                <CardAd key={idx} data={ad} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
