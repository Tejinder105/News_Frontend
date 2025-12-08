import React, { useMemo, useState, useEffect, useRef } from "react";
import { BookOpen, X } from "lucide-react";
import DOMPurify from "dompurify";
import LazyYouTubeEmbed from "./LazyYouTubeEmbed";

const extractYouTubeVideoId = (url) => {
  if (!url || typeof url !== "string") return null;

  const regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.*[&?]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const SanitizedHtmlRenderer = ({ content }) => (
  <article className="article-content font-serif">
    <div
      className="prose prose-lg md:prose-xl max-w-none px-4 py-8 text-gray-800 md:px-8 first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-bold first-letter:text-gray-900 first-letter:leading-none"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(content, {
          ADD_TAGS: ["iframe"],
          ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
        }),
      }}
    />
  </article>
);

const SmartVideo = ({ videoId }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const anchorRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0 }); // 0 means "as soon as 1 pixel is visible"

    if (anchorRef.current) observer.observe(anchorRef.current);
    return () => observer.disconnect();
  }, []);

  const isFloating = !isIntersecting && !isClosed;

  return (
    <div className="relative scroll-mt-20 bg-gray-50 px-4 py-8 md:px-8">
      {/* Anchor to detect visibility. Needs to cover the area where video SHOULD be. */}
      <div ref={anchorRef} className="absolute inset-0 pointer-events-none" />

      <div className="mx-auto max-w-4xl">
        {/* We need to maintain space to prevent layout shift when fixed */}
        <div className="aspect-video w-full">
          <div className={isFloating ? "fixed bottom-5 right-5 z-50 w-80 aspect-video shadow-2xl rounded-xl overflow-hidden ring-1 ring-black/10 transition-all duration-500 animate-in slide-in-from-bottom-5" : "w-full h-full rounded-xl overflow-hidden shadow-lg bg-black"}>
            {isFloating && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsClosed(true); }}
                className="absolute top-2 right-2 z-[60] bg-black/50 text-white rounded-full p-1 hover:bg-black/70 backdrop-blur-sm"
              >
                <X size={14} />
              </button>
            )}
            <LazyYouTubeEmbed videoId={videoId} />
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyContent = () => (
  <div className="flex items-center justify-center py-16">
    <div className="text-center">
      <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
      <p className="text-lg text-gray-500">No content available</p>
    </div>
  </div>
);

const ArticleContent = ({ content, youtubeLink }) => {
  const videoId = useMemo(
    () => extractYouTubeVideoId(youtubeLink),
    [youtubeLink]
  );

  if (!content?.trim()) return <EmptyContent />;

  return (
    <>
      <SanitizedHtmlRenderer content={content} />
      {videoId && <SmartVideo videoId={videoId} />}
    </>
  );
};

export default ArticleContent;
