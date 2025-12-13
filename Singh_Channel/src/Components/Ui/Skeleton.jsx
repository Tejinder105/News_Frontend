import React from "react";

/**
 * Reusable skeleton loading components for better UX
 * These show placeholder animations while content is loading
 */

// Base skeleton with shimmer animation
export const SkeletonBase = ({ className = "" }) => (
    <div
        className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
        style={{
            animation: "shimmer 1.5s ease-in-out infinite",
        }}
    />
);

// Card skeleton for article cards
export const CardSkeleton = ({ variant = "vertical", imageHeight = "h-40" }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {variant === "vertical" ? (
            <>
                {/* Image placeholder */}
                <SkeletonBase className={`${imageHeight} w-full`} />
                {/* Content */}
                <div className="p-4 space-y-3">
                    <SkeletonBase className="h-5 w-3/4" />
                    <SkeletonBase className="h-4 w-full" />
                    <SkeletonBase className="h-4 w-2/3" />
                    <div className="flex justify-between pt-2">
                        <SkeletonBase className="h-3 w-20" />
                        <SkeletonBase className="h-3 w-16" />
                    </div>
                </div>
            </>
        ) : (
            <div className="flex items-center gap-3 p-3">
                <div className="flex-1 space-y-2">
                    <SkeletonBase className="h-4 w-full" />
                    <SkeletonBase className="h-4 w-3/4" />
                    <SkeletonBase className="h-3 w-1/2" />
                </div>
                <SkeletonBase className="h-24 w-1/3 rounded-lg shrink-0" />
            </div>
        )}
    </div>
);

// Hero section skeleton
export const HeroSkeleton = () => (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-7 lg:gap-4 mb-2">
        {/* Featured article skeleton */}
        <div className="lg:col-span-4">
            <SkeletonBase className="h-[375px] w-full rounded-2xl" />
        </div>
        {/* Top stories skeleton */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-gray-100 h-[375px]">
            <SkeletonBase className="h-6 w-32 mb-4" />
            <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <SkeletonBase className="h-4 w-full" />
                        <SkeletonBase className="h-4 w-3/4" />
                        <SkeletonBase className="h-3 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Article page skeleton
export const ArticlePageSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
                {/* Left sidebar */}
                <aside className="hidden lg:col-span-3 lg:block">
                    <div className="space-y-4">
                        <SkeletonBase className="h-6 w-32" />
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex gap-3">
                                <SkeletonBase className="h-16 w-16 rounded shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <SkeletonBase className="h-4 w-full" />
                                    <SkeletonBase className="h-3 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main content */}
                <main className="lg:col-span-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                        {/* Title */}
                        <SkeletonBase className="h-8 w-full" />
                        <SkeletonBase className="h-8 w-3/4" />
                        
                        {/* Meta */}
                        <div className="flex gap-4">
                            <SkeletonBase className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <SkeletonBase className="h-4 w-24" />
                                <SkeletonBase className="h-3 w-32" />
                            </div>
                        </div>

                        {/* Image */}
                        <SkeletonBase className="h-64 w-full rounded-lg" />

                        {/* Content paragraphs */}
                        <div className="space-y-3">
                            {[...Array(6)].map((_, i) => (
                                <SkeletonBase key={i} className="h-4 w-full" />
                            ))}
                            <SkeletonBase className="h-4 w-2/3" />
                        </div>
                    </div>
                </main>

                {/* Right sidebar */}
                <aside className="lg:col-span-3">
                    <div className="space-y-4">
                        <SkeletonBase className="h-4 w-24" />
                        {[...Array(3)].map((_, i) => (
                            <SkeletonBase key={i} className="h-48 w-full rounded-lg" />
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    </div>
);

// Dashboard stats skeleton
export const StatsSkeleton = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                    <SkeletonBase className="h-12 w-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <SkeletonBase className="h-4 w-20" />
                        <SkeletonBase className="h-6 w-16" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Grid of cards skeleton
export const CardGridSkeleton = ({ count = 6, columns = 3 }) => (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-${columns}`}>
        {[...Array(count)].map((_, i) => (
            <CardSkeleton key={i} />
        ))}
    </div>
);

// Table skeleton
export const TableSkeleton = ({ rows = 5 }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex gap-4">
            <SkeletonBase className="h-4 w-24" />
            <SkeletonBase className="h-4 w-32" />
            <SkeletonBase className="h-4 w-20" />
            <SkeletonBase className="h-4 w-16" />
        </div>
        {/* Rows */}
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-100 flex gap-4 items-center">
                <SkeletonBase className="h-10 w-10 rounded shrink-0" />
                <div className="flex-1 space-y-2">
                    <SkeletonBase className="h-4 w-3/4" />
                    <SkeletonBase className="h-3 w-1/2" />
                </div>
                <SkeletonBase className="h-6 w-16 rounded-full" />
                <SkeletonBase className="h-8 w-20 rounded" />
            </div>
        ))}
    </div>
);

// Add shimmer keyframes to index.css or inline style
const shimmerStyle = `
@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
`;

// Inject shimmer animation style
if (typeof document !== "undefined") {
    const styleElement = document.createElement("style");
    styleElement.textContent = shimmerStyle;
    document.head.appendChild(styleElement);
}

export default {
    SkeletonBase,
    CardSkeleton,
    HeroSkeleton,
    ArticlePageSkeleton,
    StatsSkeleton,
    CardGridSkeleton,
    TableSkeleton,
};
