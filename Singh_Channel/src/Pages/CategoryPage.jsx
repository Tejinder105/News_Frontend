import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spinner, Button, SectionHeading, CityNewsLayout } from "../Components";
import articleService from "../Services/articleService";
import { useSelector } from "react-redux";

const CategoryPage = () => {
    const { tag } = useParams();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const language = useSelector((s) => s.language.current);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                setError(null);
                // Use the tag param to filter articles
                const { articles } = await articleService.getAllArticles(
                    language,
                    1,
                    20,
                    tag
                );
                setArticles(Array.isArray(articles) ? articles : []);
            } catch (err) {
                console.error("Error fetching articles:", err);
                setError("Failed to load articles. Please try again later.");
                setArticles([]);
            } finally {
                setLoading(false);
            }
        };

        if (tag) {
            fetchArticles();
        }
    }, [tag, language]);

    const formatCategoryName = (str) => {
        return str
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <Spinner size="large" color="blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <div className="text-center">
                    <p className="mb-4 text-red-500">{error}</p>
                    <Button variant="primary" onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <SectionHeading
                        title={formatCategoryName(tag || "News")}
                        color="blue"
                    />
                </div>

                {articles.length > 0 ? (
                    articles.length >= 5 ? (
                        <CityNewsLayout articles={articles} />
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {articles.map((item) => (
                                <Card key={item.slug} article={item} />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="flex h-64 items-center justify-center rounded-lg bg-white p-8 shadow-sm">
                        <p className="text-lg text-gray-500">
                            No articles found for {formatCategoryName(tag || "this category")}.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
