import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import { Clock, Share2, BookOpen, Quote } from "lucide-react";

const extractYouTubeVideoId = (url) => {
  if (!url || typeof url !== "string") return null;

  // Regular expression to match various YouTube URL formats
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
};

const ArticleContent = ({ content, title, author, youtubeLink }) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
      setShowProgressBar(window.pageYOffset > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate estimated read time
  useEffect(() => {
    if (content) {
      const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
      const readTime = Math.ceil(words / 200); // Average reading speed
      setEstimatedReadTime(readTime);
    }
  }, [content]);

  // Handle both HTML content (from Tiptap) and plain text content (from fallback)
  const renderContent = () => {
    if (!content) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-lg text-gray-500">No content available.</p>
          </div>
        </div>
      );
    }

    // Check if content is HTML (contains HTML tags)
    const isHtml = /<[a-z][\s\S]*>/i.test(content);

    if (isHtml) {
      // Render HTML content from Tiptap with enhanced typography
      return (
        <article className="article-content">
          <div
            className="prose prose-xl prose-headings:font-playfair prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mt-0 prose-h1:mb-6 prose-h1:leading-tight prose-h1:font-black prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:leading-tight prose-h2:font-bold prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:font-semibold prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3 prose-h4:font-semibold prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-700 prose-p:mb-6 prose-p:font-serif prose-p:tracking-tight prose-strong:text-gray-900 prose-strong:font-semibold prose-em:text-gray-700 prose-em:italic prose-a:text-blue-600 prose-a:no-underline prose-a:font-medium hover:prose-a:text-blue-700 hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-blue-50 prose-blockquote:to-indigo-50 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:my-8 prose-blockquote:font-serif prose-blockquote:text-xl prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:leading-relaxed prose-ul:text-gray-700 prose-ul:text-lg prose-ul:font-serif prose-ol:text-gray-700 prose-ol:text-lg prose-ol:font-serif prose-li:mb-2 prose-li:leading-relaxed prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-gray-800 max-w-none px-6 py-6 md:px-8 lg:px-10"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>
      );
    } else {
      // Handle plain text content with enhanced styling and typography
      const paragraphs = content
        .split(/\n\n+/)
        .filter((para) => para.trim() !== "");

      return (
        <article className="article-content px-6 py-6 md:px-8 lg:px-10">
          <div className="max-w-none space-y-6">
            {paragraphs.map((paragraph, index) => {
              const trimmedParagraph = paragraph.trim();

              // Create a pull quote for the first compelling sentence
              if (index === 1 && trimmedParagraph.length > 100) {
                const firstSentence = trimmedParagraph.split(".")[0] + ".";
                const remainingText = trimmedParagraph
                  .substring(firstSentence.length)
                  .trim();

                return (
                  <div key={index} className="space-y-6">
                    <div className="relative my-8 rounded-r-2xl border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 shadow-sm">
                      <Quote className="absolute top-4 left-4 h-6 w-6 text-blue-500 opacity-50" />
                      <p className="pl-8 font-serif text-xl leading-relaxed font-medium text-gray-800 italic">
                        {firstSentence}
                      </p>
                    </div>
                    {remainingText && (
                      <p className="article-body drop-cap">{remainingText}</p>
                    )}
                  </div>
                );
              }

              // First paragraph gets drop cap styling
              if (index === 0) {
                return (
                  <p key={index} className="article-body drop-cap">
                    {trimmedParagraph}
                  </p>
                );
              }

              return (
                <p key={index} className="article-body">
                  {trimmedParagraph}
                </p>
              );
            })}
          </div>
        </article>
      );
    }
  };

  // Extract video ID from YouTube link
  const videoId = extractYouTubeVideoId(youtubeLink);

  return (
    <>
      {/* Main Content */}
      {!content || content.trim() === "" ? (
        <div className="px-4 py-8 md:px-5 lg:px-6">
          <div className="text-center">
            <p className="text-lg text-gray-500">No content available.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Check if content is HTML (contains HTML tags) */}
          {/<[a-z][\s\S]*>/i.test(content) ? (
            <article className="article-content">
              <div
                className="prose prose-xl prose-headings:font-Inter prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:leading-tight prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:font-Inter prose-p:text-gray-800 prose-p:text-lg prose-p:leading-[1.75] prose-p:mb-4 prose-strong:text-gray-900 prose-strong:font-semibold prose-em:text-gray-700 prose-em:italic prose-a:text-blue-600 prose-a:no-underline prose-a:font-medium hover:prose-a:text-blue-700 hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:my-4 prose-ul:text-gray-800 prose-ul:text-lg prose-ol:text-gray-800 prose-ol:text-lg prose-li:mb-1 prose-li:leading-relaxed prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono max-w-none px-4 py-4 md:px-5 lg:px-6"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </article>
          ) : (
            <article className="article-content px-4 py-4 md:px-5 lg:px-6">
              <div className="max-w-none space-y-4">
                {content
                  .split(/\n\n+/)
                  .filter((para) => para.trim() !== "")
                  .map((paragraph, index) => {
                    const trimmedParagraph = paragraph.trim();
                    return (
                      <p
                        key={index}
                        className="font-Inter text-lg leading-[1.75] text-gray-800"
                      >
                        {trimmedParagraph}
                      </p>
                    );
                  })}
              </div>
            </article>
          )}
        </>
      )}

      {/* Enhanced Related Video Section */}
      {videoId && (
        <div className="bg-white px-4 py-4 md:px-5 lg:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 shadow-2xl">
              <div className="aspect-video">
                <YouTube
                  videoId={videoId}
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: {
                      autoplay: 0,
                      rel: 0,
                      modestbranding: 1,
                      showinfo: 0,
                    },
                  }}
                  className="h-full w-full"
                />
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleContent;
