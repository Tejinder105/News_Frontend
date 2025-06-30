import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ResourceNotFound, Spinner, Weather, CardAd, Button } from "../Components";
import YouTube from "react-youtube";
import {
  FastForward,
  Clock,
  User,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { adItem } from "../AdItem";

function NewsArticle() {
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <ResourceNotFound />
      </div>
    );
  }

  const paragraphs = content.content
    ? content.content.split(/\n\n|\n/).filter((para) => para.trim() !== "")
    : ["No content available."];



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-12">
      {/* Floating Back Button */}
      <div className="fixed top-28 left-4 z-50">
        <button
          className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-medium text-slate-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={18} />
          Back to News
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative mb-8">
        <div className="h-64 overflow-hidden sm:h-80 md:h-[28rem] lg:h-[30rem]">
          <img
            src={content.image}
            alt={content.img_cap}
            className="lazyload h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
          

            <h1 className="mb-3 max-w-4xl font-['Montserrat'] text-2xl font-bold text-white drop-shadow-xl sm:text-3xl md:text-4xl lg:text-5xl">
              {content.headline}
            </h1>

            <p className="mb-4 max-w-4xl font-['Roboto'] text-base text-gray-100 drop-shadow-md sm:text-lg md:text-xl">
              {content.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>{content.by}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{content.uploaded_Time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Article Content */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-xl bg-white shadow-lg">
              {/* Action Bar */}
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-1">
                  <FastForward size={18}  className="text-sky-500"/>
                  <span className="text-sm text-slate-500">
                    {Math.ceil(content.content?.split(" ").length / 200) || 5}{" "}
                    min read
                  </span>
                </div>
                <Button iconRight={<Share2 size={18} className="text-sky-500"/>} variant="outline" size="small">
                    <span className="text-sm text-slate-500">Share</span>
                </Button>
              </div>

              <div className="p-4 md:p-6 lg:p-8">
                <article className="prose prose-lg max-w-none">
                  {paragraphs.map((para, index) => (
                    <p
                      key={index}
                      className="font-Inter mb-6 leading-relaxed text-slate-700"
                    >
                      {para}
                    </p>
                  ))}
                </article>

                {/* Video Section */}
                <div className="my-8">
                  <h3 className="mb-4 font-['Montserrat'] text-xl font-bold text-slate-800">
                    Related Video
                  </h3>
                  <div className="aspect-video w-full overflow-hidden rounded-xl shadow-lg">
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
            </div>
          </div>

          {/* Sidebar */}
           <div className="space-y-6">
            <Weather />

            <div className="overflow-hidden rounded-xl  shadow-lg">
              <div className="border-b p-2 mb-2">
                <h2 className="font-['Montserrat'] text-lg font-bold text-slate-800">
                  Advertisements
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {adItem.map((ad, idx) => (
                  <CardAd key={idx} data={ad} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsArticle;
