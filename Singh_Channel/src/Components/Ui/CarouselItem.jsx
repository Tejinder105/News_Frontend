import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { formatRelativeTime } from "../../Utils/date";

function CarouselItem({ item, isActive }) {
  return (
    <div className="group relative h-full w-full overflow-hidden rounded-xl bg-slate-900">

      {/* BACKGROUND IMAGE - Full Coverage */}
      <img
        src={item.image || "/placeholder-image.jpg"}
        alt={item.headline}
        className="absolute inset-0 h-full w-full object-fill transition-transform duration-700 ease-out group-hover:scale-105"
        loading="eager"
        onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
      />

      {/* GRADIENT OVERLAY - Stronger for Readability (Audit Fix) */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/70 to-transparent" />
      
      {/* TEXT CONTENT - Bottom aligned */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 md:p-8">

        {/* Headline - Sans Serif on Mobile for Legibility (Audit Fix) */}
        <Link to={`/article/${item.slug}`} className="block">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="font-sans text-lg font-bold leading-snug text-white shadow-black drop-shadow-md tracking-wide sm:text-xl md:font-serif md:text-3xl lg:text-4xl"
          >
            {item.headline}
          </motion.h2>
        </Link>

        {/* Footer info (Time/Author) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-3 flex items-center gap-3 text-xs font-medium text-slate-300"
        >
          <span className="font-semibold text-blue-400">
            {item.author === "auth0|688e3919480c85818cab6f36"
              ? "Gurcharan Singh"
              : item.author || "Global News"}
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-500" />
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-slate-400" />
            {formatRelativeTime(item.publishedAt)}
          </span>
        </motion.div>

      </div>
    </div>
  );
}

export default CarouselItem;
