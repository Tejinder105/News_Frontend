import React, { useEffect, useState } from "react";
import { Carousel, CardAd, Card, Spinner, Button, SectionHeading } from "../Components";
import articleService from "../Services/articleService";
import { useSelector } from "react-redux";
import { adItem } from "../AdItem.jsx";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const language = useSelector((s) => s.language.current);
  const breakingNews = useSelector((state) => state.breakingNews.breakingNews);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    setPage(1);
    setArticles([]);
    fetchArticles(1, true);
  }, [language]);

  const fetchArticles = async (pageNum, reset = false) => {
    try {
      if (reset) setLoading(true);

      const controller = new AbortController();
      console.log(`Fetching page ${pageNum}...`);

      const { articles: newArticles, total } = await articleService.getAllArticles(
        language,
        pageNum,
        ITEMS_PER_PAGE,
        null,
        controller.signal
      );

      if (reset) {
        setArticles(Array.isArray(newArticles) ? newArticles : []);
      } else {
        setArticles(prev => [...prev, ...(Array.isArray(newArticles) ? newArticles : [])]);
      }

      if (newArticles.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

    } catch (err) {
      if (err.name === "CanceledError") return;
      console.error("Fetch error:", err);
      setError("Failed to load news.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage);
  };

  // --- RENDERING HELPERS ---

  // Desktop View (Standard Grid + Sidebar)
  const renderDesktopView = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {/* Main Content */}
      <div className="space-y-8 md:col-span-2 lg:col-span-3">

        {/* CAROUSEL (Moved here for Desktop to sit next to Sidebar) */}
        <Carousel items={articles.filter(a => a.isFeatured).slice(0, 5)} />

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

        {/* 1. CAROUSEL (Mobile Specific Instance) */}
        <div className="mb-2">
          <Carousel items={articles.filter(a => a.isFeatured).slice(0, 5)} />
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
    return <div className="flex h-screen items-center justify-center"><Spinner /></div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl bg-slate-50 px-2 py-3 sm:px-4 lg:px-6">
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