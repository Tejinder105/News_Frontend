import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ResourceNotFound, Spinner } from "../Components";

function NewsArticle() {
  const { id } = useParams();
  const [Content, setContent] = useState({});
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
      <>
        <Spinner />
      </>
    );
  }

  if (error) {
    return (
      <>
        <ResourceNotFound />
      </>
    );
  }

  const paragraphs = Content.content
    ? Content.content.split(/\n\n|\n/).filter((para) => para.trim() !== "")
    : ["No content available."];
  return (
    <div className="mx-auto max-w-7xl bg-slate-100 px-2 py-3 sm:px-4 lg:px-4">
      <div className="gird-cols-1 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="space-y-4 md:col-span-2 lg:col-span-3">
          <div className="relative mb-4 rounded-md">
            <img
              src={Content.image}
              alt={Content.img_cap}
              className="lazyload h-64 w-full rounded-md object-cover sm:h-80 md:h-[28rem] lg:h-[30rem]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black from-20% via-black/80 via-30% to-transparent to-60%">
              <div className="absolute bottom-0 left-0 p-2 sm:p-4">
                <h1 className="mb-2 font-['Montserrat'] text-xl font-bold text-white drop-shadow-lg sm:text-2xl md:text-3xl lg:text-5xl">
                  {Content.headline}
                </h1>
                <p className="max-w-full font-['Roboto'] text-sm text-gray-100 drop-shadow-md sm:max-w-[80%] sm:text-base md:text-xl">
                  {Content.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsArticle;
