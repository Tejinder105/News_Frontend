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
        console.log("Fetching articles with language:", language);
        const { articles } = await articleService.getAllArticles(
          language,
          1,
          20,
          null,
          controller.signal
        );
        console.log("Fetched articles:", articles);
        console.log("Articles count:", articles.length);

        if (articles.length === 0) {
          console.warn("⚠️ No articles found. Make sure you have published articles in the database.");
          console.warn("Check: 1) Backend is running, 2) MongoDB is connected, 3) Articles have status='publish'");
        }

        setArticle(Array.isArray(articles) ? articles : []);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        console.error("Error fetching articles:", err);
        console.error("Error response:", err.response);
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
    ? article.filter((item) => item?.isFeatured)
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
        <div className="text-center max-w-md px-4">
          <p className="mb-4 text-red-500 font-semibold">{error}</p>
          <p className="mb-4 text-gray-600 text-sm">
            Make sure the backend server is running on http://localhost:8000
          </p>
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
      {article.length === 0 && !loading && (
        <div className="mb-6 rounded-lg bg-yellow-50 border border-yellow-200 p-6 text-center">
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">No Articles Found</h3>
          <p className="text-yellow-700 mb-4">
            There are no published articles in the database yet.
          </p>
          <div className="text-sm text-yellow-600 space-y-2">
            <p>To add articles:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to the Admin Panel</li>
              <li>Click "Add Articles"</li>
              <li>Create a new article</li>
              <li>Make sure to set Status to "Publish"</li>
            </ol>
          </div>
        </div>
      )}

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
      </div >
    </div >
  );
}
export default Home;