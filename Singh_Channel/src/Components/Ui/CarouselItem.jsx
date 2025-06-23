import React from "react";

function CarouselItem({ item }) {
  return (
    <div className="group grid bg-white p-2 sm:grid-cols-[2fr_3fr] gap-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 hover:border-gray-200 min-w-full">
      {/* Image Container (Fixed Dimensions + Hover Effect) */}
      <div className="rounded-lg overflow-hidden h-44 w-full relative">
        <img
          src={item.image}
          alt={item.tag}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Optional: Tag Badge Overlay */}
        <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md uppercase">
          {item.tag}
        </span>
      </div>

      {/* Text Content */}
      <div className="flex flex-col justify-between py-1">
        <div>
          <h2 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
            {item.headline}
          </h2>
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">
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
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center"
          >
            Read More 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default CarouselItem;