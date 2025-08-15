import React, { useEffect, useState } from "react";
import articleService from "../../Services/articleService";
import { useSelector } from "react-redux";

function Breaking() {
  const [breakingNews, setBreakingNews] = useState([]);
  const language = useSelector((s) => s.language.current);

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        const { BreakingNews } = await articleService.getBreakingNews(
          language,
          3
        );
        setBreakingNews(Array.isArray(BreakingNews) ? BreakingNews : []);
      } catch (error) {
        console.error("Error fetching breaking news:", error);
      }
    };
    fetchBreakingNews();
  }, [language]);
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
          <div className="animate-marquee whitespace-nowrap">
            {breakingNews.length > 0 ? (
              breakingNews.map((news, index) => (
                <span key={index} className="mr-8 text-sm font-semibold">
                  <span className="mr-2 text-red-400">•</span>
                  {news}
                </span>
              ))
            ) : (
              <span className="text-sm font-semibold">
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
