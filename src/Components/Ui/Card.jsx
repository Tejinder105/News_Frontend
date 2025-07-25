@@ .. @@
 import React from "react";
 import { Link } from "react-router-dom";
-import { MapPin,Clock,Eye } from "lucide-react";
+import { MapPin, Clock, Eye, TrendingUp } from "lucide-react";
+
 function Card( {article} ) {
 
   const formatTime = (dateString) => {
@@ .. @@
   };
 
   return (
-    <div className="group cursor-pointer overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md">
+    <article className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1">
       <Link to={`/article/${article.id}`} className="block">
         <div
-          className="relative overflow-hidden h-40"
+          className="relative overflow-hidden h-48 sm:h-40"
         >
           <img
             src={article.imageUrl}
             alt={article.title}
-            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
+            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
+            loading="lazy"
           />
+          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
           {article.isBreaking && (
-            <div className="absolute top-2 left-2">
-              <span className="animate-pulse rounded bg-red-600 px-2 py-1 text-xs font-bold text-white uppercase">
+            <div className="absolute top-3 left-3">
+              <span className="animate-pulse rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white uppercase shadow-lg">
+                <span className="inline-block w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                 Breaking
               </span>
             </div>
           )}
           {article.location && (
-            <div className="absolute bottom-2 left-2">
-              <span className="flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
-                <MapPin size={10} />
+            <div className="absolute bottom-3 left-3">
+              <span className="flex items-center gap-1 rounded-full bg-black/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
+                <MapPin size={12} />
                 {article.location}
               </span>
             </div>
           )}
           {article.category && (
-            <div className="absolute right-2 bottom-2">
-              <span className="rounded bg-blue-600/90 px-2 py-1 text-xs font-medium text-white uppercase">
+            <div className="absolute right-3 bottom-3">
+              <span className="rounded-full bg-blue-600/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white uppercase">
                 {article.category}
               </span>
             </div>
           )}
         </div>
-        <div className="p-3">
+        <div className="p-4">
           <h3
-            className={`leading-tight font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 text-base`}
+            className="mb-2 line-clamp-2 text-base font-bold leading-tight text-gray-900 transition-colors duration-300 group-hover:text-blue-600 sm:text-lg"
           >
             {article.title}
           </h3>
-          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
+          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600">
             {article.description}
           </p>
-          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
+          <div className="flex items-center justify-between text-xs text-gray-500">
             <span className="flex items-center gap-1">
-              <Clock size={10} />
+              <Clock size={12} />
               {formatTime(article.publishedAt)}
             </span>
             {article.views && (
               <span className="flex items-center gap-1">
-                <Eye size={12} />
+                <Eye size={12} className="text-gray-400" />
                 {article.views > 1000
                   ? `${(article.views / 1000).toFixed(1)}k`
                   : article.views}
               </span>
             )}
           </div>
         </div>
       </Link>
-    </div>
+    </article>
   );
 }
 
 export default Card;