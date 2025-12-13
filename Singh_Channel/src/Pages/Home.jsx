import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Carousel, HeroSection, CardAd, Card, Button, SectionHeading, HeroSkeleton, CardGridSkeleton } from "../Components";
import { useSelector } from "react-redux";
import { useGetArticlesQuery, useGetBreakingNewsQuery } from "../Services/store/apiSlice";
import { adItem } from "../AdItem.jsx";

function Home() {
  // --- RTK QUERY HOOKS ---
  const language = useSelector((s) => s.language.current);
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const ITEMS_PER_PAGE = 20;

  // 1. Fetch Articles
  const {
    data: articlesData,
    isLoading: articlesLoading,
    isFetching: articlesFetching,
    error: articlesError
  } = useGetArticlesQuery({
    language,
    page,
    limit: ITEMS_PER_PAGE
  });

  // 2. Fetch Breaking News
  const { data: breakingNews = [] } = useGetBreakingNewsQuery({ language });

  // 3. Append new articles when data arrives
  useEffect(() => {
    if (articlesData?.articles) {
      if (page === 1) {
        setArticles(articlesData.articles);
      } else {
        // De-duplication: Only add articles that aren't already in the list
        setArticles(prev => {
          const existingIds = new Set(prev.map(a => a._id));
          const newUniqueArticles = articlesData.articles.filter(a => !existingIds.has(a._id));
          return [...prev, ...newUniqueArticles];
        });
      }
    }
  }, [articlesData, page]);

  // 4. Reset on language change
  useEffect(() => {
    setPage(1);
    // Don't clear articles here; let the data effect handle replacement when new data arrives.
    // This prevents clearing cached data when navigating back to the page.
  }, [language]);

  const hasMore = articlesData?.pagination?.hasNext;
  const loading = articlesLoading && page === 1;
  const error = articlesError ? "Failed to load news." : null;

  // Memoized callback to prevent unnecessary re-renders
  const handleLoadMore = useCallback(() => {
    if (!articlesFetching && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [articlesFetching, hasMore]);

  // --- MEMOIZED COMPUTED VALUES ---
  
  // Compute hero data with useMemo to prevent recalculation on every render
  const featured = useMemo(() => 
    articles.find(a => a.isFeatured) || articles[0], 
    [articles]
  );
  
  const topStories = useMemo(() => 
    articles.filter(a => a._id !== featured?._id).slice(0, 5),
    [articles, featured?._id]
  );

  // Desktop View (Standard Grid + Sidebar)
  const renderDesktopView = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {/* Main Content */}
      <div className="space-y-8 md:col-span-2 lg:col-span-3">

        {/* NEW HERO SECTION (Replaces Carousel) */}
        <HeroSection featured={featured} topStories={topStories} />

        {/* Breaking News Section (Desktop) */}
        {breakingNews.length > 0 && (
          <div>
            <SectionHeading title="Breaking News" color="red" animated />
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {breakingNews.slice(0, 3).map(item => <Card key={item.slug} article={item} />)}
            </div>
          </div>
        )}

        {/* Latest News Section (Desktop) */}
        <div>
          <SectionHeading title="Latest News" color="blue" />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map(item => <Card key={item.slug} article={item} />)}
          </div>

          {/* Desktop Load More */}
          {hasMore && (
            <div className="mt-8 text-center">
              <Button onClick={handleLoadMore} variant="outline" size="lg">Load More News</Button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar (Weather Removed - Ads Only) */}
      <div className="space-y-6 md:col-span-1">
        {/* Ads Section */}
        <div className="sticky top-24">
          <h2 className="mb-4 border-b-2 border-slate-200 pb-2 text-lg font-bold text-gray-800">
            <span className="text-blue-600">Sponsored</span>
          </h2>
          <div className="space-y-4">
            {adItem.map((ad, i) => <CardAd key={i} data={ad} />)}
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile View (Patterned Feed)
  const renderMobileView = () => {
    const allItems = [...breakingNews, ...articles];
    const uniqueItems = Array.from(new Set(allItems.map(a => a.slug)))
      .map(slug => allItems.find(a => a.slug === slug));

    // PATTERN BLOCKS
    const BLOCK_1_GRID = uniqueItems.slice(0, 4);      // 2x2 Grid (Photo+Text)
    const BLOCK_2_LIST = uniqueItems.slice(4, 9);      // 5 List Items (Text+Photo)
    const BLOCK_3_GRID = uniqueItems.slice(9, 13);     // 2x2 Grid (Headline?) 
    const REMAINING = uniqueItems.slice(13);        // Rest...

    return (
      <div className="flex flex-col gap-6">

        {/* 1. HERO SECTION (Replaces Carousel on Mobile too) */}
        <div className="mb-2">
          <HeroSection featured={featured} topStories={topStories} />
        </div>

        {/* 2. 2x2 GRID (Photo + Text) */}
        {BLOCK_1_GRID.length > 0 && (
          <div>
            <h3 className="mb-2 text-lg font-bold text-gray-900 border-l-4 border-red-600 pl-2">Top Stories</h3>
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_1_GRID.map(item => (
                <Card key={item.slug} article={item} imageHeight="h-24" headlineClasses="text-xs font-bold leading-tight" />
              ))}
            </div>
          </div>
        )}

        {/* 3. LIST (5 Items - Horizontal) */}
        {BLOCK_2_LIST.length > 0 && (
          <div>
            <h3 className="mb-2 text-lg font-bold text-gray-900 border-l-4 border-blue-600 pl-2">Latest</h3>
            <div className="flex flex-col gap-3">
              {BLOCK_2_LIST.map(item => (
                <Card key={item.slug} article={item} variant="horizontal" />
              ))}
            </div>
          </div>
        )}

        {/* 4. 2x2 GRID (Headlines/Standard) */}
        {BLOCK_3_GRID.length > 0 && (
          <div>
            <h3 className="mb-2 text-lg font-bold text-gray-900 border-l-4 border-purple-600 pl-2">More News</h3>
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_3_GRID.map(item => (
                <Card key={item.slug} article={item} imageHeight="h-24" headlineClasses="text-xs font-bold leading-tight" />
              ))}
            </div>
          </div>
        )}

        {/* 5. ADS (2x2 Grid) */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase text-gray-400">Sponsored</span>
            <div className="h-[1px] flex-1 bg-gray-200" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {adItem.slice(0, 4).map((ad, i) => (
              <CardAd key={i} data={ad} />
            ))}
          </div>
        </div>

        {/* 6. REMAINING */}
        {REMAINING.length > 0 && (
          <div className="flex flex-col gap-3 mt-4">
            {REMAINING.map(item => (
              <Card key={item.slug} article={item} variant="horizontal" />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="mt-4">
            <Button onClick={handleLoadMore} fullWidth variant="secondary">
              Load More Stories
            </Button>
          </div>
        )}
      </div>
    );
  };

  // --- MAIN RENDER ---
  if (loading && articles.length === 0) {
    return (
      <div className="mx-auto max-w-7xl bg-slate-50 px-2 py-3 sm:px-4 lg:px-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-8 md:col-span-2 lg:col-span-3">
            <HeroSkeleton />
            <CardGridSkeleton count={6} columns={3} />
          </div>
          <div className="hidden md:block space-y-4">
            <div className="h-8 w-24 rounded bg-gray-200 animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-40 rounded-lg bg-gray-200 animate-pulse" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl bg-slate-50 px-2 py-3 sm:px-4 lg:px-2">
      {/* MOBILE Layout (Visible only on small screens) */}
      <div className="block md:hidden">
        {renderMobileView()}
      </div>

      {/* DESKTOP Layout (Visible only on medium+ screens) */}
      <div className="hidden md:block">
        {renderDesktopView()}
      </div>
    </div>
  );
}

export default Home;