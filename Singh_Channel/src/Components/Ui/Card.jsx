import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Card({ id, title, description, timeAgo, imageUrl }) {
  return (
    <div className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="aspect-auto h-35 w-full flex-shrink-0">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-grow flex-col p-3">
        <h3 className="mb-1 text-sm font-bold text-gray-900 sm:text-base">
          {title}
        </h3>
        <p className="mb-2 line-clamp-2 text-xs font-medium text-gray-700 sm:text-sm">
          {description}
        </p>
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500 sm:text-sm">
          <span>{timeAgo}</span>
          <Link 
            to={`/article/${id}`}
            className="flex items-center font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            <span>Read More</span> <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;
