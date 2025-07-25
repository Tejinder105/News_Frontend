@@ .. @@
 import React, { useEffect, useMemo, useState } from "react";
 import { useParams } from "react-router-dom";
+import { ArrowLeft, Clock, Share2, Bookmark, ThumbsUp } from "lucide-react";
 import ArticleHeader from "../Components/Article/ArticleHeader";
 import ArticleContent from "../Components/Article/ArticleContent";
 import SkeletonArticle from "../Components/Article/SkeletonArticle";
 import ResourceNotFound from "../Components/Ui/ResourceNotFound";
-
 import CardAd from "../Components/Ui/CardAd";
 import { newsItem } from "../NewItem.js";
 import { adItem } from "../AdItem.jsx";
 
-function NewsArtilcle() {
+function NewsArticle() {
   const { id } = useParams();
   const [content, setContent] = useState({});
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(false);
+  const [isBookmarked, setIsBookmarked] = useState(false);
+  const [likes, setLikes] = useState(0);
 
   const formatTime = (dateString) => {
     const date = new Date(dateString);
     const now = new Date();
     const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
     
     if (diffInHours < 1) return 'Just now';
     else if (diffInHours < 24) return `${diffInHours} hours ago`;
     else if (diffInHours < 48) return 'Yesterday';
     else if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
     return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
   };
 
+  const handleShare = async () => {
+    if (navigator.share) {
+      try {
+        await navigator.share({
+          title: content.headline,
+          text: content.description,
+          url: window.location.href,
+        });
+      } catch (error) {
+        console.log('Error sharing:', error);
+      }
+    } else {
+      navigator.clipboard.writeText(window.location.href);
+      // You could add a toast notification here
+    }
+  };
+
+  const handleBookmark = () => {
+    setIsBookmarked(!isBookmarked);
+    // Here you would typically save to localStorage or send to API
+  };
+
+  const handleLike = () => {
+    setLikes(prev => prev + 1);
+    // Here you would typically send to API
+  };
+
   useEffect(() => {
     setLoading(true);
     setError(false);
+    
+    // Simulate random likes for demo
+    setLikes(Math.floor(Math.random() * 50) + 10);
+    
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
 
   const relatedArticles = useMemo(() => {
     return newsItem.filter((item) => item.id !== id);
   }, [id]);
 
   if (loading) return <SkeletonArticle />;
   if (error) return <ResourceNotFound />;
 
   return (
-  <div className="grid min-h-screen grid-cols-1 gap-4 bg-slate-100 p-4 md:grid-cols-12">
-    {/* Related News - Left on Desktop, Second on Mobile */}
-    <div className="order-2 md:order-1 md:col-span-3">
-      <div className="space-y-6">
-        <div className="rounded-md border border-gray-200 bg-white shadow-sm">
-          <div className="border-b border-gray-200 p-4">
-            <h3 className="text-lg font-semibold text-gray-900">Related News</h3>
-          </div>
-          <div className="divide-y divide-gray-200">
-            {relatedArticles.slice(0, 5).map((news, index) => (
-              <div
-                key={news.id || index}
-                className="cursor-pointer px-4 py-3 transition-colors hover:bg-gray-50"
-              >
-                <div className="flex gap-3">
-                  <div>
-                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-sm text-white">
-                      {index + 1}
-                    </span>
-                  </div>
-                  <div className="min-w-0 flex-1">
-                    <h4 className="line-clamp-3 text-sm font-medium leading-tight text-gray-900">
-                      {news.title}
-                    </h4>
-                    <div className="flex items-center gap-2 text-xs text-gray-500">
-                      <span>{formatTime(news.publishedAt)}</span>
+    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
+      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
+        {/* Back Button */}
+        <div className="mb-6">
+          <button
+            onClick={() => window.history.back()}
+            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
+          >
+            <ArrowLeft size={16} />
+            Back to News
+          </button>
+        </div>
+
+        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
+          {/* Related News - Left Sidebar */}
+          <div className="order-2 lg:order-1 lg:col-span-3">
+            <div className="sticky top-24 space-y-6">
+              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
+                <div className="border-b border-gray-200 p-6">
+                  <h3 className="text-lg font-semibold text-gray-900">Related News</h3>
+                </div>
+                <div className="divide-y divide-gray-100">
+                  {relatedArticles.slice(0, 5).map((news, index) => (
+                    <div
+                      key={news.id || index}
+                      className="group cursor-pointer px-6 py-4 transition-colors hover:bg-gray-50"
+                    >
+                      <div className="flex gap-3">
+                        <div>
+                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white group-hover:bg-blue-700">
+                            {index + 1}
+                          </span>
+                        </div>
+                        <div className="min-w-0 flex-1">
+                          <h4 className="line-clamp-3 text-sm font-medium leading-tight text-gray-900 group-hover:text-blue-600">
+                            {news.title}
+                          </h4>
+                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
+                            <Clock size={12} />
+                            <span>{formatTime(news.publishedAt)}</span>
+                          </div>
+                        </div>
+                      </div>
                     </div>
-                  </div>
+                  ))}
                 </div>
               </div>
-            ))}
+            </div>
           </div>
-        </div>
-      </div>
-    </div>
 
-    {/* Main Article Content - Centered on Desktop, First on Mobile */}
-    <div className="order-1 md:order-2 md:col-span-6">
-      <div className="rounded-md bg-white">
-        <ArticleHeader
-          title={content.headline}
-          author={content.by}
-          publishedTime={content.uploaded_Time}
-          category={content.category || "News"}
-          imageUrl={content.image}
-          summary={content.summary}
-        />
-        <ArticleContent content={content.content} />
-      </div>
-    </div>
+          {/* Main Article Content */}
+          <div className="order-1 lg:order-2 lg:col-span-6">
+            <article className="rounded-xl bg-white shadow-sm">
+              <ArticleHeader
+                title={content.headline}
+                author={content.by}
+                publishedTime={content.uploaded_Time}
+                category={content.category || "News"}
+                imageUrl={content.image}
+                summary={content.summary}
+                articleBody={content.content}
+              />
+              
+              {/* Article Actions */}
+              <div className="border-b border-gray-100 px-6 py-4">
+                <div className="flex items-center justify-between">
+                  <div className="flex items-center gap-4">
+                    <button
+                      onClick={handleLike}
+                      className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
+                    >
+                      <ThumbsUp size={16} />
+                      {likes}
+                    </button>
+                    <button
+                      onClick={handleBookmark}
+                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
+                        isBookmarked
+                          ? 'bg-blue-50 text-blue-600'
+                          : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
+                      }`}
+                    >
+                      <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
+                      {isBookmarked ? 'Saved' : 'Save'}
+                    </button>
+                  </div>
+                  <button
+                    onClick={handleShare}
+                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
+                  >
+                    <Share2 size={16} />
+                    Share
+                  </button>
+                </div>
+              </div>
+              
+              <ArticleContent content={content.content} />
+            </article>
+          </div>
 
-    {/* Ads - Right on Desktop, Last on Mobile */}
-    <div className="order-3 md:order-3 md:col-span-3">
-      <div className="grid grid-cols-1 gap-4">
-        {adItem.map((ad, idx) => (
-          <CardAd key={idx} data={ad} />
-        ))}
+          {/* Ads - Right Sidebar */}
+          <div className="order-3 lg:order-3 lg:col-span-3">
+            <div className="sticky top-24 space-y-6">
+              <div className="rounded-xl bg-white p-6 shadow-sm">
+                <div className="mb-6 flex items-center">
+                  <h3 className="text-lg font-semibold text-gray-900">
+                    <span className="text-blue-600">Sponsored</span>
+                  </h3>
+                  <div className="ml-3 h-px flex-1 bg-gradient-to-r from-blue-600 to-transparent" />
+                </div>
+                <div className="space-y-4">
+                  {adItem.map((ad, idx) => (
+                    <CardAd key={idx} data={ad} />
+                  ))}
+                </div>
+              </div>
+            </div>
+          </div>
+        </div>
       </div>
     </div>
-  </div>
-);
+  );
 }
 
-export default NewsArtilcle;
+export default NewsArticle;