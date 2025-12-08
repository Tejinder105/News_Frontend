import React from "react";
import { useSelector } from "react-redux";

function Breaking() {
  const { breakingNews, loading, error } = useSelector((state) => state.breakingNews);

  // Extract headlines from breaking news articles
  const headlines = breakingNews.map((article) => article.headline || article.title);

  // Don't render if no content and not loading
  if (!loading && headlines.length === 0 && !error) {
    return null;
  }

  return (
    <div className="bg-black py-1 text-white">
      <div className="relative mx-auto flex max-w-7xl items-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Breaking tag */}
        <div className="relative z-20 mr-4">
          <span className="inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-bold tracking-wider uppercase">
            BREAKING
          </span>
        </div>

        {/* Scrolling text */}
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee-seamless">
            {loading ? (
              <span className="text-sm font-semibold pl-4">
                Loading breaking news...
              </span>
            ) : error ? (
              <span className="text-sm font-semibold text-red-300 pl-4">
                Unable to load breaking news
              </span>
            ) : headlines.length > 0 ? (
              <>
                <div className="flex shrink-0 items-center gap-8 pr-8">
                  {headlines.map((headline, index) => (
                    <span key={`1-${index}`} className="text-sm font-semibold flex items-center">
                      <span className="mr-2 text-red-400">•</span>
                      {headline}
                    </span>
                  ))}
                </div>
                {/* Duplicate for seamless effect */}
                <div className="flex shrink-0 items-center gap-8 pr-8">
                  {headlines.map((headline, index) => (
                    <span key={`2-${index}`} className="text-sm font-semibold flex items-center">
                      <span className="mr-2 text-red-400">•</span>
                      {headline}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <span className="text-sm font-semibold pl-4">
                No breaking news available
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Breaking;
