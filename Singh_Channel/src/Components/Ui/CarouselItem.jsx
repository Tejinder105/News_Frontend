import React from "react";
import { ArrowRight  } from "lucide-react";
function CarouselItem({ item }) {
  return (
    <div className="group grid h-full w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_3fr]">
      <div className="relative h-full w-full overflow-hidden rounded-lg">
        <img
          src={item.image}
          alt={item.tag}
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        {/* Optional: Tag Badge Overlay */}
        <span className="absolute top-2 left-2 rounded-md bg-gray-800/80 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-white">
          {item.tag}
        </span>
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-4  p-2">
        <div className="space-y-2">
          <h2 className="line-clamp-2 text-lg font-bold text-gray-900 transition-colors hover:text-blue-600 lg:text-2xl">
            {item.headline}
          </h2>
          <p className="line-clamp-3 text-sm text-gray-700 md:line-clamp-4 ">
            {item.description}
          </p>
        </div>

        {/* Footer (Author + Read More) */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <span>{item.time}</span> · <span>by {item.author}</span>
          </div>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Read More
           <ArrowRight size={16} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default CarouselItem;
