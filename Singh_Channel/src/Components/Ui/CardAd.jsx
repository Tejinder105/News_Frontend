import React from "react";
import { ArrowRight } from "lucide-react";
import { getOptimizedImageUrl } from "../../Utils/image";
import adminService from "../../Services/adminService";

function CardAd({ data }) {
  const handleClick = async () => {
    // Track the click if we have an ID (from backend)
    if (data._id) {
      try {
        await adminService.trackAdClick(data._id);
      } catch (err) {
        // Silently fail - don't block the user
        console.error("Failed to track ad click:", err);
      }
    }
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition-all hover:bg-slate-100 hover:shadow-md">

      {/* Image Section */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={getOptimizedImageUrl(data.image, { width: 500 })}
          alt={data.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* 'Ad' Badge Overlay */}
        <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm rounded-sm">
          Ad
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">

        {/* Sponsored Label */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
            Sponsored
          </span>
          <span className="text-[10px] font-medium text-slate-500">
            {data.name}
          </span>
        </div>

        {/* Headline */}
        <h3 className="mb-2 font-serif text-lg font-bold leading-snug text-slate-900 group-hover:text-blue-700 transition-colors">
          {data.headline}
        </h3>

        {/* Description */}
        <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
          {data.description}
        </p>

        {/* CTA Button */}
        <a
          href={data.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-white border border-slate-300 py-2.5 text-sm font-semibold text-slate-800 transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 group/btn"
        >
          {data.tag || "Learn More"}
          <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
        </a>

      </div>
    </div>
  );
}

export default CardAd;
