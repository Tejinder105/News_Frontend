import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatRelativeTime } from "../../Utils/date";
import { getOptimizedImageUrl } from "../../Utils/image";

function CarouselItem({ item }) {

  return (
    <div className="group flex flex-col h-full w-full overflow-hidden rounded-lg bg-white shadow-md sm:grid sm:grid-cols-2 lg:grid-cols-[2fr_3fr]">
      {/* Image Container - Top on mobile (fixed height), Left on desktop */}
      <div className="relative h-40 w-full shrink-0 sm:h-full sm:w-full overflow-hidden">
        <img
          src={getOptimizedImageUrl(item.image, { width: 800 }) || "/placeholder-image.jpg"}
          alt={item.tag || item.category || "News"}
          className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
        />
      </div>

      {/* Text Content - Bottom on mobile (White bg), Right on desktop */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:justify-start sm:p-6 bg-white text-gray-900">
        <div>
          <div className="mb-2">
            <span className="inline-block rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white mb-2">
              {item.category || "Featured"}
            </span>
            <h2 className="font-serif line-clamp-2 text-lg font-bold leading-tight text-gray-900 sm:text-2xl lg:text-3xl sm:group-hover:text-blue-600 transition-colors">
              {item.headline}
            </h2>
          </div>

          <div className="hidden sm:line-clamp-2 text-sm text-gray-600 leading-relaxed">
            {item.summary}
          </div>
        </div>

        {/* Footer (Author + Read More) */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="text-xs font-medium text-gray-500">
            <span>{formatRelativeTime(item.publishedAt)}</span>
            <span className="mx-1">·</span>
            <span>{item.author || "Gurcharan Singh"}</span>
          </div>
          <Link
            to={`/article/${item.slug}`}
            className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Read More
            <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CarouselItem;
