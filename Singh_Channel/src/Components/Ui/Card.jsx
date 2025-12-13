import React, { memo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, BookOpen } from "lucide-react";
import { useSelector } from "react-redux";
import { formatRelativeTime } from "../../Utils/date";
import Panel from "./Panel";
import OptimizedImage from "./OptimizedImage";

/**
 * Card component for displaying article previews
 * Wrapped with React.memo to prevent unnecessary re-renders
 */
const Card = memo(
  function Card({
    article,
    imageHeight = "h-40",
    showImage = true,
    showSummary = true,
    variant = "vertical",
    headlineClasses = "",
  }) {
    const language = useSelector((s) => s.language.current);

    const titleClass =
      headlineClasses ||
      (variant === "horizontal"
        ? "text-sm font-bold leading-tight"
        : "text-base leading-tight font-bold");

    return (
      <Panel variant="card" padding={false} className="h-full">
        <Link
          to={`/article/${article.slug}`}
          className={`block h-full ${variant === "horizontal" ? "flex flex-row items-center gap-3 p-3" : ""}`}
        >
          {/* IMAGE SECTION */}
          {showImage && (
            <div
              className={`relative overflow-hidden ${
                variant === "horizontal"
                  ? "order-2 h-24 w-1/3 shrink-0 rounded-lg" // Image on Right for Horizontal
                  : `${imageHeight} w-full`
              }`}
            >
              <OptimizedImage
                src={article.image}
                alt={article.headline}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Breaking Badge (Only on non-horizontal mobile or if space permits) */}
              {article.isBreaking && variant !== "horizontal" && (
                <div className="absolute top-2 left-2">
                  <span className="animate-pulse rounded-sm bg-red-600 px-2 py-1 text-[10px] font-bold text-white uppercase">
                    {language === "hi"
                      ? "ब्रेकिंग"
                      : language === "pu"
                        ? "ਬ੍ਰੇਕਿੰਗ"
                        : "Breaking"}
                  </span>
                </div>
              )}
              {/* Location Badge */}
              {article.location && variant !== "horizontal" && (
                <div className="absolute bottom-2 left-2">
                  <span className="flex items-center gap-1 rounded-sm bg-black/70 px-2 py-1 text-[10px] font-medium text-white">
                    <MapPin size={9} />
                    {article.location}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TEXT SECTION */}
          <div
            className={`${variant === "horizontal" ? "order-1 w-2/3 p-0" : "p-4"}`}
          >
            {/* HEADLINE: No line-clamp as requested */}
            <h3
              className={`${titleClass} font-serif text-gray-900 transition-colors duration-300 group-hover:text-blue-600`}
            >
              {article.headline}
            </h3>

            {/* Summary - HIDDEN ON MOBILE (sm:block) - Strictly 2 Lines */}
            {showSummary && variant !== "horizontal" && (
              <p
                className="mt-2 hidden text-sm leading-normal text-gray-700 sm:block"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {article.summary}
              </p>
            )}

            {/* Metadata */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {formatRelativeTime(article.publishedAt)}
              </span>
              {/* Read Time */}
              {article.readTime && variant !== "horizontal" && (
                <span className="flex items-center gap-1">
                  <BookOpen size={12} />
                  {article.readTime} min read
                </span>
              )}
            </div>
          </div>
        </Link>
      </Panel>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for memo
    // Only re-render if article data actually changes
    return (
      prevProps.article?.slug === nextProps.article?.slug &&
      prevProps.article?.headline === nextProps.article?.headline &&
      prevProps.article?.image === nextProps.article?.image &&
      prevProps.variant === nextProps.variant &&
      prevProps.imageHeight === nextProps.imageHeight
    );
  }
);

export default Card;
