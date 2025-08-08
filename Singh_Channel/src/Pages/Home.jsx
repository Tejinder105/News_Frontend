import React, { useEffect, useState } from "react";
import { Carousel, Weather, CardAd, Card, Spinner } from "../Components";
import { items } from "../carousel.js";
import articleService from "../Services/articleService";
import { toast } from "react-toastify";

const adItem = [
    {
        name: "Vintage Accessories",
        image: "/shop.jpg",
        tag: "Shop Now",
        headline: "Discover Unique Vintage Accessories",
        description:
            "Curated vintage accessories to add nostalgia to your style.",
        link: "https://example.com/shop",
    },
    {
        name: "Alpine Top",
        image: "/school.jpg",
        tag: "Learn More",
        headline: "Alpine Top: Elevate Your Style",
        description:
            "The Alpine Top blends comfort and style for any occasion.",
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

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await articleService.getAllArticles(
                    "en",
                    1,
                    20
                );

                // Handle different response structures
                let articlesData = [];
                if (Array.isArray(response)) {
                    articlesData = response;
                } else if (
                    response.articles &&
                    Array.isArray(response.articles)
                ) {
                    articlesData = response.articles;
                } else if (response.data && Array.isArray(response.data)) {
                    articlesData = response.data;
                } else if (
                    response.data &&
                    response.data.articles &&
                    Array.isArray(response.data.articles)
                ) {
                    articlesData = response.data.articles;
                }

                console.log("Processed articles data:", articlesData);
                setArticle(articlesData);
            } catch (error) {
                console.error("Error fetching articles:", error);
                setError("Failed to load articles. Please try again later.");
                toast.error("Failed to load articles");
                setArticle([]);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    // Add safety check for filter operations
    const breakingNews = Array.isArray(article)
        ? article.filter((item) => item?.isBreaking)
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
                    <Carousel items={items} />

                    {breakingNews.length > 0 && (
                        <div className="mb-8">
                            <div className="mb-4 flex items-center">
                                <h2 className="mr-3 flex items-center gap-2 text-lg font-bold text-gray-900 sm:text-xl">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
                                    Breaking News
                                </h2>
                                <div className="h-px flex-1 bg-red-600" />
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {breakingNews.slice(0, 10).map((item) => (
                                    <Card
                                        key={item._id || item.id || item.slug}
                                        article={item}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
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

                {/* Sidebar */}
                <div className="space-y-4 md:col-span-1">
                    <Weather />
                    <div>
                        <h2 className="mb-4 border-b-2 border-slate-200 pb-3 text-lg font-bold text-gray-800 sm:text-xl lg:text-2xl dark:border-slate-700 dark:text-gray-100">
                            <span className="inline-block text-blue-600">
                                Advertisements
                            </span>
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
