import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Eye } from "lucide-react";
import { useSelector } from "react-redux";

function Card({ article }) {
    const language = useSelector((s) => s.language.current);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) return "Just now";
        else if (diffInHours < 24) return `${diffInHours} hours ago`;
        else if (diffInDays === 1) return "Yesterday";
        else if (diffInDays === 2) return "2 days ago";
        else {
            return date.toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        }
    };
    return (
        <div className="group cursor-pointer overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md">
            <Link to={`/article/${article.slug}`} className="block">
                <div className="relative h-40 overflow-hidden">
                    <img
                        src={article.image}
                        alt={article.headline}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                        }}
                    />
                    {article.isBreaking && (
                        <div className="absolute top-2 left-2">
                            <span className="animate-pulse rounded bg-red-600 px-2 py-1 text-xs font-bold text-white uppercase">
                                {language === "hi"
                                    ? "ब्रेकिंग"
                                    : language === "pu"
                                      ? "ਬ੍ਰੇਕਿੰਗ"
                                      : "Breaking"}
                            </span>
                        </div>
                    )}
                    {article.location && (
                        <div className="absolute bottom-2 left-2">
                            <span className="flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
                                <MapPin size={10} />
                                {article.location}
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-3">
                    <h3 className="text-base leading-tight font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                        {article.headline}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                        {article.summary}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {formatTime(article.publishedAt)}
                        </span>
                        {article.views > 0 && (
                            <span className="flex items-center gap-1">
                                <Eye size={12} />
                                {article.views > 1000
                                    ? `${(article.views / 1000).toFixed(1)}k`
                                    : article.views}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default Card;
