import React, { useState } from "react";
import Button from "../Ui/Button";
import {
  Share2,
  Calendar,
  User,
  Clock,
  Tag,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

const ArticleHeader = ({
  title,
  author,
  publishedTime,
  readTime,
  imageUrl,
  summary,
}) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: summary || `Read this article: ${title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
      alert("Link copied to clipboard!");
    }
  };

  return (
    <header className="bg-white">
      {/* Main Header Content */}
      <div className="px-4 py-4 md:px-5 lg:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Article Title */}
          <h1 className="font-Inter mb-3 text-3xl leading-tight font-bold text-gray-900 md:text-4xl lg:text-2xl">
            {title}
          </h1>

          {/* Article Summary */}
          {summary && (
            <div className="mb-4">
              <div className="rounded-r-xl border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm">
                <p className="text-lg leading-relaxed text-gray-700">
                  {summary}
                </p>
              </div>
            </div>
          )}
          
          {/* Article Meta Information */}
          <div className="flex flex-col  md:space-y-0 md:space-x-4 mb-2">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {author && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-gray-900">{author}</span>
                </div>
              )}

              {publishedTime && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(publishedTime)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span className="font-medium text-gray-900">{readTime}</span>
              </div>

              <Button
                iconLeft={<Share2 size={14} color="blue" />}
                type="button"
                variant="outline"
                onClick={handleShare}
              >
                Share
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          {imageUrl && (
            <div className="mb-6">
              <figure className="relative group">
                <div className="relative overflow-hidden rounded-3xl bg-gray-100 shadow-2xl ring-1 ring-gray-200/50">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="h-auto w-full object-cover transition-all duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  
                  {/* Image overlay with title on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <h3 className="text-xl font-bold drop-shadow-2xl">
                      {title}
                    </h3>
                  </div>
                </div>
              </figure>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ArticleHeader;
