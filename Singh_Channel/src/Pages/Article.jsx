import { FastForward } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import { CardAd, ResourceNotFound, Spinner } from "../Components";
import { adItem } from "../AdItem";

function Article() {
  const { id } = useParams();
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`/Articles/${id}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("File not found");
        return res.json();
      })
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
     <Spinner/>
    );
  }

  if (error) {
    return (
    <ResourceNotFound/>
    );
  }

  const paragraphs = content.content
    ? content.content.split(/\n\n|\n/).filter((para) => para.trim() !== "")
    : ["No content available."];

  return (
    <div className="min-h-screen bg-[#232323] py-6 px-2">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <div className="relative rounded-xl overflow-hidden mb-4">
            <img
              src={content.image || "/fallback-image.jpg"}
              alt={content.img_cap || "Article image"}
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute left-0 bottom-0 p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mb-2">
                {content.headline}
              </h1>
              <p className="text-base sm:text-lg text-gray-200 drop-shadow">
                {content.description}
              </p>
              <div className="text-xs text-gray-300 mt-2">
                {content.by} | {content.uploaded_Time}
              </div>
            </div>
          </div>
      
          <div className="bg-[#181818] rounded-xl p-6 text-gray-200">
            <div className="mb-6 aspect-video w-full">
              <YouTube
                videoId="ju6L9octAAs"
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: { autoplay: 0, rel: 0 },
                }}
                className="h-full w-full overflow-hidden rounded-lg"
              />
            </div>
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 flex flex-col gap-3 text-base leading-relaxed text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                <p>{content.uploaded_Time}</p>
                <div className="flex items-center gap-2">
                  <FastForward size={18} className="text-blue-500" />
                  <span>
                    {Math.ceil(content.content?.split(" ").length / 200) || 5}{" "}
                    min read
                  </span>
                </div>
              </div>
              <article className="mb-4 text-base leading-7 text-gray-300 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
                {paragraphs.map((para, index) => (
                  <p key={index} className="mb-4 text-gray-300">
                    {para}
                  </p>
                ))}
              </article>
            </div>
          </div>
        </div>
    
        <div className="lg:col-span-4 flex flex-col gap-4">
          <CardAd data={adItem[0]} />
         
          <CardAd data={adItem[1]} />
        </div>
      </div>
    </div>
  );
}

export default Article;
