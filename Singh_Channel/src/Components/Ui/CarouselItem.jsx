import React from "react";

function CarouselItem({ item }) {
  return (
    <div className="group grid h-full w-full gap-4 rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:border-gray-200 hover:shadow-md sm:grid-cols-[2fr_3fr]">
      <div className="relative h-full w-full overflow-hidden rounded-lg">
        <img
          src={item.image}
          alt={item.tag}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Optional: Tag Badge Overlay */}
        <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white uppercase">
          {item.tag}
        </span>
      </div>

      {/* Text Content */}
      <div className="flex flex-col justify-between py-1">
        <div>
          <h2 className="line-clamp-2 text-lg font-bold text-gray-900 transition-colors hover:text-blue-600">
            {item.headline}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm text-gray-600">
            {item.description}
          </p>
        </div>

        {/* Footer (Author + Read More) */}
        <div className="mt-4 flex items-center justify-between">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default CarouselItem;
