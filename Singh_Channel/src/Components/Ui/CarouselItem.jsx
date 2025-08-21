import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatRelativeTime } from "../../utils/date";
function CarouselItem({ item }) {
  
  return (
    <div className="group grid h-full w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_3fr]">
      <div className="relative h-full w-full overflow-hidden rounded-lg">
        <img
          src={item.image || "/placeholder-image.jpg"}
          alt={item.tag || item.category || "News"}
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-4 p-2">
        <div className="">
          <h2 className="line-clamp-2 text-lg font-bold text-gray-900 transition-colors hover:text-blue-600 lg:text-2xl">
            {item.headline}
          </h2>
        </div>
        <div className="line-clamp-3 flex-1 text-sm text-gray-700 md:line-clamp-4">
          {item.summary}
        </div>

        {/* Footer (Author + Read More) */}
        <div className="flex flex-1 items-center justify-between">
          <div className="text-xs text-gray-500">
            <span>{formatRelativeTime(item.publishedAt)}</span> ·{" "}
            <span>by {item.author || "Gurcharan Singh"}</span>
          </div>
          <Link
            to={`/article/${item.slug}`}
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Read More
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CarouselItem;
