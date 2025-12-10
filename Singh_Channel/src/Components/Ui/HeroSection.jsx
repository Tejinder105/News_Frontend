import React from "react";
import { Link } from "react-router-dom";
import { Clock, Eye } from "lucide-react";
import { formatRelativeTime } from "../../Utils/date";

const HeroSection = ({ featured, topStories }) => {
    if (!featured) return null;

    // 👉 Take only first 6 stories
    const limitedStories = topStories.slice(0, 4);

    // 👉 Split into two columns of 3 each
    const firstColumn = limitedStories.slice(0, 2);
    const secondColumn = limitedStories.slice(2, 4);

    return (
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-7 lg:gap-4 mb-2">
            
            {/* LEFT SIDE — FEATURED BANNER */}
            <div className="lg:col-span-4 group">
                <Link to={`/article/${featured.slug}`} className="block h-full">
                    <div className="relative h-[375px] w-full overflow-hidden rounded-2xl shadow-lg">
                        <img
                            src={featured.image}
                            alt={featured.headline}
                            loading="eager"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                        <div className="absolute bottom-0 p-6 md:p-8 w-full">
                            {featured.isBreaking && (
                                <span className="mb-3 inline-block rounded bg-red-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider animate-pulse">
                                    Breaking News
                                </span>
                            )}

                            <h1 className="mb-3 font-serif text-xl font-bold leading-tight text-white drop-shadow-md md:text-2xl">
                                {featured.headline}
                            </h1>

                            <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-300">
                                <span className="text-blue-400 font-semibold">{featured.author || "Global News"}</span>
                                <span className="flex items-center gap-1">
                                    <Clock size={14} /> {formatRelativeTime(featured.publishedAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* RIGHT SIDE — 2 COLUMN TOP STORIES */}
            <div className="lg:col-span-3 rounded-2xl bg-white p-5 shadow-sm border border-gray-100 h-[375px] overflow-hidden flex flex-col">
                <h3 className=" flex items-center gap-2 border-b-2 border-red-500 font-sans text-base font-bold text-gray-900 uppercase tracking-wide">
                    <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
                    Top Stories
                </h3>

                <div className="grid grid-cols-2 gap-2 flex-1">
                    
                    {/* COLUMN 1 */}
                    <div className="flex flex-col gap-2 divide-y divide-gray-100">
                        {firstColumn.map((story) => (
                            <Link key={story.slug} to={`/article/${story.slug}`} className="group">
                                <h4 className="font-serif text-sm font-semibold leading-snug text-gray-800 transition-colors group-hover:text-blue-600">
                                    {story.headline}
                                </h4>

                                <div className="mt-1 flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-wide">
                                    <span>{formatRelativeTime(story.publishedAt)}</span>
                                    {story.views > 500 && (
                                        <span className="flex items-center gap-1 text-gray-400">
                                            <Eye size={10} /> {story.views}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* COLUMN 2 */}
                    <div className="flex flex-col gap-2 divide-y divide-gray-100">
                        {secondColumn.map((story) => (
                            <Link key={story.slug} to={`/article/${story.slug}`} className="group">
                                <h4 className="font-serif text-sm font-semibold leading-snug text-gray-800 transition-colors group-hover:text-blue-600">
                                    {story.headline}
                                </h4>

                                <div className="mt-1 flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-wide">
                                    <span>{formatRelativeTime(story.publishedAt)}</span>
                                    {story.views > 500 && (
                                        <span className="flex items-center gap-1 text-gray-400">
                                            <Eye size={10} /> {story.views}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HeroSection;
