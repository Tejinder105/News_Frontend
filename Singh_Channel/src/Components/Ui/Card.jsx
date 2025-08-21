import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { formatRelativeTime } from "../../utils/date";
import Panel from "./Panel";

function Card({ article }) {
    const language = useSelector((s) => s.language.current);

    
    return (
        <Panel variant="card" padding={false}>
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
                            {formatRelativeTime(article.publishedAt)}
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
        </Panel>
    );
}

export default Card;
