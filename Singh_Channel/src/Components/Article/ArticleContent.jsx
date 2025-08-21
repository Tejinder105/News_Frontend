import React, { useMemo } from "react";
import { BookOpen } from "lucide-react";
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
  <article className="article-content">
    <div
      className="prose prose-xl max-w-none px-6 py-6 md:px-8 lg:px-10"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(content, {
          ADD_TAGS: ["iframe"],
          ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
        }),
      }}
    />
  </article>
);

const YouTubeEmbed = ({ videoId }) => (
  <div className="bg-white px-4 py-8 md:px-6 lg:px-8">
    <div className="mx-auto max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 shadow-2xl">
        <div className="aspect-video">
          <LazyYouTubeEmbed videoId={videoId} />
        </div>
      </div>
    </div>
  </div>
);

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
  const isHtml = useMemo(() => /<[a-z][\s\S]*>/i.test(content), [content]);

  if (!content?.trim()) return <EmptyContent />;

  return (
    <>
      <SanitizedHtmlRenderer content={content} />
      {videoId && <YouTubeEmbed videoId={videoId} />}
    </>
  );
};

export default ArticleContent;
