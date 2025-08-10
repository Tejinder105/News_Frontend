import React, { useEffect, useState, useMemo } from "react";
import { Carousel, Weather, CardAd, Card, Spinner } from "../Components";
import articleService from "../Services/articleService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const adItem = [
  {
    name: "Vintage Accessories",
    image: "/shop.jpg",
    tag: "Shop Now",
    headline: "Discover Unique Vintage Accessories",
    description: "Curated vintage accessories to add nostalgia to your style.",
    link: "https://example.com/shop",
  },
  {
    name: "Alpine Top",
    image: "/school.jpg",
    tag: "Learn More",
    headline: "Alpine Top: Elevate Your Style",
    description: "The Alpine Top blends comfort and style for any occasion.",
    link: "https://example.com/alpine-top",
  },
  {
    name: "Punjabi Jutti House",
    image: "/jutti.jpg",
    tag: "Shop Now",
    headline: "Punjabi Jutti House: Traditional Footwear",
    description: "Handcrafted Punjabi Juttis reflecting rich heritage.",
    link: "https://example.com/jutti-house",
  },
  {
    name: "Retro Fashion",
    image: "/clothes.jpg",
    tag: "Shop Now",
    headline: "Retro Fashion: Timeless Styles",
    description: "Classic retro fashion and accessories that never age.",
    link: "https://example.com/retro-fashion",
  },
];

function Home() {
  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const language = useSelector((s) => s.language.current);

  console.log("Current language in Home:", language); // Debug log

  useEffect(() => {
    console.log("Fetching articles for language:", language); // Debug log
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
        console.log("Fetched articles:", articles); // Debug log
        setArticle(Array.isArray(articles) ? articles : []);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again later.");
        toast.error("Failed to load articles");
        setArticle([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
    return () => controller.abort();
  }, [language]);

  const breakingNews = Array.isArray(article)
    ? article.filter((item) => item?.isBreaking)
    : [];

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
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Retry
          </button>
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
              <div className="mb-4 flex items-baseline">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 sm:text-xl">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
                  Breaking News
                </h2>
                <div className="mt-1 ml-4 h-px flex-1 bg-red-600" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {breakingNews.slice(0, 10).map((item) => (
                  <Card key={item._id || item.id || item.slug} article={item} />
                ))}
              </div>
            </div>
          )}

          {/* Regular News Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-baseline">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 sm:text-xl">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                Latest News
              </h2>
              <div className="mt-1 ml-4 h-px flex-1 bg-blue-600" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.isArray(article) &&
                article
                  .filter((item) => !item.isBreaking)
                  .map((item) => (
                    <Card
                      key={item._id || item.id || item.slug}
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
