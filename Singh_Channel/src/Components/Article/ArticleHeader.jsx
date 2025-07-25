import React from "react";
import Button from "../Ui/Button";
import { Share, Share2 } from "lucide-react";

const ArticleHeader = ({
  title,
  author,
  publishedTime,
  category,
  imageUrl,
  summary,
  articleBody,
}) => {
  const calculateReadTime = (text) => {
    if (!text || typeof text !== "string") {
      return "0 min read";
    }
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    const minutes = Math.ceil(noOfWords / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <div className="pt-2 pb-4">
      <div className="mx-auto max-w-4xl px-4">
        {/* Title */}
        <h1 className="mb-3 text-3xl font-bold text-gray-900 uppercase md:text-4xl">
          {title}
        </h1>

        {/* Author and Date */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2 ">
          <div className="flex-col">
            <div>
              <span>{author}</span>
              <span className="mx-2">|</span>
              <span>Updated: {publishedTime}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span>Read Time: {calculateReadTime(articleBody)}</span>
            </div>
          </div>
          <div>
            {/* sharebutton */}
            <Button
              iconLeft={<Share2 size={16} color="white" />}
              type="button"
              className="rounded-md"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: document.title,
                      text: "Check this out!",
                      url: window.location.href,
                    })
                    .then(() => console.log("Shared successfully"))
                    .catch((error) => console.error("Error sharing:", error));
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard (Share not supported)");
                }
              }}
            >
              Share
            </Button>
          </div>
        </div>

        {summary && (
          <div className="rounded-lg bg-gray-50 p-4">
            <h2 className="mb-2 text-lg font-bold">QUICK READ</h2>
            <ul className="list-inside list-disc space-y-2 text-gray-700">
              {summary.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Image */}
        {imageUrl && (
          <div className="">
            <img src={imageUrl} alt={title} className="w-full rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleHeader;
