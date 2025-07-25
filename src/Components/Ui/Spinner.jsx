@@ .. @@
 import React from "react";
 
-function Spinner() {
+function Spinner({ size = "md", color = "blue-600", className = "" }) {
+  const sizeClasses = {
+    sm: "h-4 w-4",
+    md: "h-6 w-6", 
+    lg: "h-8 w-8",
+    xl: "h-12 w-12"
+  };
+
   return (
-    <div className="flex items-center justify-center">
-      <div className="relative h-5 w-5">
-        <div className="absolute h-full w-full rounded-full border-3 border-gray-200/50"></div>
-        <div className="absolute h-full w-full animate-spin rounded-full border-3 border-transparent border-t-white border-r-white"></div>
+    <div className={`flex items-center justify-center ${className}`}>
+      <div className={`relative ${sizeClasses[size]}`}>
+        <div className="absolute h-full w-full rounded-full border-2 border-gray-200"></div>
+        <div className={`absolute h-full w-full animate-spin rounded-full border-2 border-transparent border-t-${color}`}></div>
       </div>
     </div>
   );
 }
 
 export default Spinner;