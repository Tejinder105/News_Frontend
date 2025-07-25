@@ .. @@
 import React, { useEffect, useState } from "react";
 import { Carousel, Weather, CardAd, Card, Spinner } from "../Components";
 import { items } from "../carousel.js";
+import { AlertCircle, TrendingUp, Clock } from "lucide-react";
 
 import { newsItem } from "../NewItem.js";
 const adItem = [
@@ .. @@
 
 function Home() {
   const [article, setArticle] = useState([]);
   const [loading, setLoading] = useState(true);
+  const [error, setError] = useState(null);
+  const [activeFilter, setActiveFilter] = useState('all');
+
   useEffect(() => {
-    setTimeout(() => {
-      setArticle(newsItem);
-      setLoading(false);
-    }, 500);
+    const loadArticles = async () => {
+      try {
+        // Simulate API call
+        await new Promise(resolve => setTimeout(resolve, 800));
+        setArticle(newsItem);
+      } catch (err) {
+        setError('Failed to load articles');
+      } finally {
+        setLoading(false);
+      }
+    };
+    
+    loadArticles();
   }, []);
 
   const breakingNews = article.filter((item) => item?.isBreaking);
+  const recentNews = article.filter((item) => item?.isRecent);
+  
+  const getFilteredArticles = () => {
+    switch(activeFilter) {
+      case 'breaking':
+        return breakingNews;
+      case 'recent':
+        return recentNews;
+      default:
+        return article;
+    }
+  };
+
+  const filteredArticles = getFilteredArticles();
 
   if (loading) {
     return (
-      <div className="flex min-h-screen items-center justify-center bg-slate-100">
+      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
         <div className="text-center">
-          <div>
-            <Spinner size="large" color="blue-500" />
+          <div className="mb-4">
+            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
           </div>
-          <p className="text-gray-600">Loading...</p>
+          <p className="text-lg font-medium text-gray-600">Loading Singh Channel...</p>
+          <p className="text-sm text-gray-500">Getting the latest news for you</p>
         </div>
       </div>
     );
   }
+
+  if (error) {
+    return (
+      <div className="flex min-h-screen items-center justify-center bg-slate-100">
+        <div className="text-center">
+          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
+          <p className="text-lg font-medium text-gray-800">{error}</p>
+          <button 
+            onClick={() => window.location.reload()} 
+            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
+          >
+            Try Again
+          </button>
+        </div>
+      </div>
+    );
+  }
+
   return (
-    <div className="mx-auto max-w-7xl bg-slate-100 px-2 py-3 sm:px-4 lg:px-6">
-      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
-        <div className="space-y-4 md:col-span-2 lg:col-span-3">
-          <Carousel items={items} />
+    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
+      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
+        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
+          {/* Main Content */}
+          <div className="space-y-6 lg:col-span-3">
+            {/* Hero Carousel */}
+            <div className="overflow-hidden rounded-2xl shadow-lg">
+              <Carousel items={items} />
+            </div>
+
+            {/* Filter Tabs */}
+            <div className="flex flex-wrap gap-2 rounded-xl bg-white p-2 shadow-sm">
+              {[
+                { key: 'all', label: 'All News', icon: null },
+                { key: 'breaking', label: 'Breaking', icon: <AlertCircle size={16} /> },
+                { key: 'recent', label: 'Recent', icon: <Clock size={16} /> }
+              ].map(filter => (
+                <button
+                  key={filter.key}
+                  onClick={() => setActiveFilter(filter.key)}
+                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
+                    activeFilter === filter.key
+                      ? 'bg-blue-600 text-white shadow-md'
+                      : 'text-gray-600 hover:bg-gray-100'
+                  }`}
+                >
+                  {filter.icon}
+                  {filter.label}
+                  <span className="ml-1 rounded-full bg-current px-2 py-0.5 text-xs opacity-70">
+                    {filter.key === 'all' ? article.length : 
+                     filter.key === 'breaking' ? breakingNews.length : 
+                     recentNews.length}
+                  </span>
+                </button>
+              ))}
+            </div>
 
-          {breakingNews.length > 0 && (
-            <div className="mb-8">
-              <div className="mb-4 flex items-center">
-                <h2 className="mr-3 flex items-center gap-2 text-xl font-bold text-gray-900">
-                  <div className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
-                  Breaking News
+            {/* Breaking News Section */}
+            {activeFilter === 'all' && breakingNews.length > 0 && (
+              <section className="rounded-xl bg-white p-6 shadow-sm">
+                <div className="mb-6 flex items-center">
+                  <h2 className="mr-3 flex items-center gap-2 text-2xl font-bold text-gray-900">
+                    <div className="h-3 w-3 animate-pulse rounded-full bg-red-600" />
+                    Breaking News
+                  </h2>
+                  <div className="h-px flex-1 bg-gradient-to-r from-red-600 to-transparent" />
+                </div>
+                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
+                  {breakingNews.slice(0, 6).map((item) => (
+                    <Card key={item.id} article={item} />
+                  ))}
+                </div>
+              </section>
+            )}
+
+            {/* Main News Grid */}
+            <section className="rounded-xl bg-white p-6 shadow-sm">
+              <div className="mb-6 flex items-center justify-between">
+                <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
+                  <TrendingUp className="h-6 w-6 text-blue-600" />
+                  {activeFilter === 'all' ? 'Latest News' : 
+                   activeFilter === 'breaking' ? 'Breaking News' : 'Recent News'}
                 </h2>
-                <div className="h-px flex-1 bg-red-600" />
+                <span className="text-sm text-gray-500">
+                  {filteredArticles.length} articles
+                </span>
               </div>
-              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
-                {breakingNews.slice(0, 10).map((item) => (
+              
+              {filteredArticles.length > 0 ? (
+                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
+                  {(activeFilter === 'all' ? 
+                    filteredArticles.filter(item => !item.isBreaking) : 
+                    filteredArticles
+                  ).map((item) => (
+                    <Card key={item.id} article={item} />
+                  ))}
+                </div>
+              ) : (
+                <div className="py-12 text-center">
+                  <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
+                  <p className="text-gray-600">No articles found for this filter</p>
+                </div>
+              )}
+            </section>
+          </div>
+
+          {/* Sidebar */}
+          <div className="space-y-6 lg:col-span-1">
+            {/* Weather Widget */}
+            <Weather />
+            
+            {/* Advertisements */}
+            <div className="rounded-xl bg-white p-6 shadow-sm">
+              <div className="mb-6 flex items-center">
+                <h2 className="text-xl font-bold text-gray-800">
+                  <span className="text-blue-600">Sponsored</span>
+                </h2>
+                <div className="ml-3 h-px flex-1 bg-gradient-to-r from-blue-600 to-transparent" />
+              </div>
+              <div className="space-y-4">
+                {adItem.map((ad, idx) => (
                   <Card key={item.id} article={item} />
                 ))}
               </div>
             </div>
-          )}
-          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
-            {newsItem
-              .filter((item) => !item.isBreaking)
-              .map((item) => (
-                <Card key={item.id} article={item} />
-              ))}
-          </div>
-        </div>
-
-        {/* Sidebar */}
-        <div className="space-y-4 md:col-span-1">
-          <Weather />
-          <div>
-            <h2 className="mb-4 border-b-2 border-slate-200 pb-3 text-xl font-bold text-gray-800 sm:text-2xl dark:border-slate-700 dark:text-gray-100">
-              <span className="inline-block text-blue-600">
-                Advertisements
-              </span>
-            </h2>
-            <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
-              {adItem.map((ad, idx) => (
-                <CardAd key={idx} data={ad} />
-              ))}
-            </div>
           </div>
         </div>
       </div>
     </div>
   );
 }
+
 export default Home;