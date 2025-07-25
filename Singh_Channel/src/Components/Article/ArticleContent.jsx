import React from "react";
import YouTube from "react-youtube";
const ArticleContent = ({ content }) => {
  const paragraphs = content
    ? content.split(/\n\n+/).filter((para) => para.trim() !== "")
    : ["No content available."];

  return (
    <>
      <div className="prose prose-lg font-Inter max-w-none p-2 font-medium">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="mb-5 text-base leading-relaxed text-gray-700 md:text-[15.5px]"
          >
            {paragraph.trim()}
          </p>
        ))}
      </div>
      <div className="my-4">
        <h3 className="mb-4 ml-2 flex items-center gap-2 font-['Montserrat'] text-xl font-semibold tracking-wide text-slate-800">
          <span className="block h-5 w-1 rounded bg-blue-600"></span>
          Related Video
        </h3>
        <div className="relative w-full overflow-hidden rounded-xl pb-[56.25%] shadow-lg">
          <div className="absolute top-0 left-0 h-full w-full">
            <YouTube
              videoId="ju6L9octAAs"
              opts={{
                width: "100%",
                height: "100%",
                playerVars: { autoplay: 0, rel: 0 },
              }}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleContent;
