import React from "react";
import { Link } from "react-router-dom";
import Card from "../Ui/Card";
import CardAd from "../Ui/CardAd";
import { adItem } from "../../AdItem";
import { formatRelativeTime } from "../../Utils/date";

const CityNewsLayout = ({ articles }) => {
    if (!articles || articles.length === 0) return null;

    // Distribute articles
    const heroArticle = articles[0];

    // Middle Grid: Needs 6 articles
    const middleGridArticles = articles.slice(1, 7);

    const bottomArticles = articles.slice(7);

    // Get a random ad
    const displayAd = adItem && adItem.length > 0 ? adItem[0] : null;

    return (
        <div className="space-y-8">
            {/* Top Section: Hero | Middle 2x3 Grid | Ad */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

                {/* Left: Hero Article (4 Columns -> ~33%) */}
                <div className="lg:col-span-4 xl:col-span-4">
                    {heroArticle && (
                        <div className="h-full">
                            <Card
                                article={heroArticle}
                                imageHeight="h-64 sm:h-80 lg:h-[400px]"
                                showSummary={true}
                            />
                        </div>
                    )}
                </div>

                {/* Center: 2x3 Grid (4 Columns -> ~33%) */}
                <div className="lg:col-span-4 xl:col-span-4">
                    <div className="grid grid-cols-2 gap-4 h-full">
                        {middleGridArticles.map((article, index) => {
                            // First 2 articles (index 0 and 1) show images
                            // Remaining (index 2, 3, 4, 5) are text only
                            const showImage = index < 2;
                            return (
                                <div key={article.slug} className="col-span-1">
                                    <Card
                                        article={article}
                                        imageHeight="h-24"
                                        showImage={showImage}
                                        showSummary={false} // Hide summary for all small grid items
                                        headlineClasses="text-sm font-semibold line-clamp-3 leading-snug"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Advertisement (4 Columns -> ~33%) */}
                <div className="lg:col-span-4 xl:col-span-4">
                    <div className="space-y-4 sticky top-4">
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                            <div className="text-xs text-center text-gray-400 mb-2 uppercase tracking-wide">Advertisement</div>
                            {displayAd ? (
                                <CardAd data={displayAd} />
                            ) : (
                                <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                                    Ad Space
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-bold text-blue-800 mb-2">Local Helplines</h4>
                            <ul className="text-sm space-y-1 text-blue-700">
                                <li>Police: 100</li>
                                <li>Ambulance: 108</li>
                                <li>Fire: 101</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Remaining articles */}
            {bottomArticles.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {bottomArticles.map((article) => (
                        <Card key={article.slug} article={article} imageHeight="h-40" />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CityNewsLayout;
