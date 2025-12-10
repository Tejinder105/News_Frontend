import React, { useState } from "react";
import Button from "../Ui/Button";
import { Share2, Calendar, User, Clock } from "lucide-react";
import { formatDateTime } from "../../Utils/date";
import LikeButton from "./LikeButton";

const ArticleHeader = ({
  title,
  author,
  publishedTime,
  readTime,
  imageUrl,
  summary,
  articleId,
}) => {
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
      alert("Link copied to clipboard!");
    }
  };

  return (
    <header className="bg-white">
      <div className="px-4 py-4 md:px-5 lg:px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-Inter mb-3 text-3xl leading-tight font-bold text-gray-900 md:text-4xl lg:text-2xl">
            {title}
          </h1>
          {summary && (
            <div className="mb-6">
              <div className="relative overflow-hidden rounded-lg bg-gray-50 border-l-4 border-gray-900 p-6">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-400">
                  Key Takeaways
                </h3>
                <p className="text-lg italic leading-relaxed text-gray-700 font-serif">
                  {summary}
                </p>
              </div>
            </div>
          )}

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-y border-gray-100 py-4">
            <div className="flex items-center space-x-6">
              {author && (
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Written By
                    </p>
                    <p className="font-medium text-gray-900">{author}</p>
                  </div>
                </div>
              )}

              {publishedTime && (
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Published
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(publishedTime)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{readTime}</span>
              </div>

              <div className="h-4 w-px bg-gray-200"></div>

              <div className="flex items-center space-x-2">
                {articleId && <LikeButton articleId={articleId} />}
                <Button
                  iconLeft={<Share2 size={16} />}
                  type="button"
                  variant="ghost"
                  className="text-gray-500 hover:text-blue-600"
                  onClick={handleShare}
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
          {imageUrl && (
            <div className="mb-6">
              <figure className="group relative">
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="h-auto w-full object-cover transition-all duration-700 hover:scale-105"
                    loading="eager"
                  />
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
