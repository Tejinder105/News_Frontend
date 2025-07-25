@@ .. @@
 import React from "react";
+import { AlertCircle } from "lucide-react";
 
 function Breaking() {
-    const BreakingNews = [
-        "रतिया में आज शाम को बिजली की आपूर्ति 4 घंटे के लिए बाधित रहेगी",
-        "फतेहाबाद जिले में नई कृषि योजना का शुभारंभ",
-        "रतिया नगर पालिका की बैठक कल आयोजित की जाएगी",
-    ];
-    return (
-        <div className="bg-black py-1 text-white">
-            <div className="relative flex max-w-7xl items-center overflow-hidden">
-                <div className="z-10 bg-black">
-                    <span className="z-10 rounded-full bg-red-700 px-3 text-sm font-semibold">
-                        BREAKING
-                    </span>
-                </div>
+  const BreakingNews = [
+    "रतिया में आज शाम को बिजली की आपूर्ति 4 घंटे के लिए बाधित रहेगी",
+    "फतेहाबाद जिले में नई कृषि योजना का शुभारंभ",
+    "रतिया नगर पालिका की बैठक कल आयोजित की जाएगी",
+    "स्थानीय किसानों के लिए नई सब्सिडी योजना की घोषणा",
+    "रतिया में नया स्वास्थ्य केंद्र का उद्घाटन अगले सप्ताह",
+  ];
 
-                <div className="animate-marquee absolute right-0 whitespace-nowrap">
-                    {BreakingNews.map((news, index) => (
-                        <span key={index} className="text-xm px-3 font-medium">
-                            <span className="mx-3 text-red-500">•</span>
-                            {news}
-                        </span>
-                    ))}
-                </div>
+  return (
+    <div className="bg-gradient-to-r from-black via-gray-900 to-black py-2 text-white shadow-lg">
+      <div className="mx-auto max-w-7xl">
+        <div className="relative flex items-center overflow-hidden">
+          {/* Breaking News Label */}
+          <div className="z-10 flex items-center bg-gradient-to-r from-black via-black to-transparent pr-4">
+            <div className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-1 shadow-lg">
+              <AlertCircle size={14} className="animate-pulse" />
+              <span className="text-sm font-bold uppercase tracking-wide">
+                Breaking
+              </span>
             </div>
+          </div>
+
+          {/* Scrolling News */}
+          <div className="flex-1 overflow-hidden">
+            <div className="animate-marquee flex whitespace-nowrap">
+              {[...BreakingNews, ...BreakingNews].map((news, index) => (
+                <span key={index} className="inline-flex items-center px-8 text-sm font-medium">
+                  <span className="mr-3 h-1 w-1 rounded-full bg-red-500"></span>
+                  {news}
+                </span>
+              ))}
+            </div>
+          </div>
+
+          {/* Gradient Fade */}
+          <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-black to-transparent"></div>
         </div>
-    );
+      </div>
+    </div>
+  );
 }
+
 export default Breaking;