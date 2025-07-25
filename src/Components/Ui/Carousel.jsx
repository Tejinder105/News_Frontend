@@ .. @@
 import React, { useState, useEffect, useCallback } from "react";
 import { AnimatePresence, motion, wrap } from "framer-motion";
-import { ChevronLeft, ChevronRight } from "lucide-react";
+import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
 import CarouselItem from "./CarouselItem";
+
 const variants = {
   enter: (direction) => ({
     x: direction > 0 ? "100%" : "-100%",
+    opacity: 0,
   }),
   center: {
     x: 0,
+    opacity: 1,
   },
   exit: (direction) => ({
     x: direction < 0 ? "100%" : "-100%",
+    opacity: 0,
   }),
 };
 
 const swipeConfidenceThreshold = 1000;
 const swipePower = (offset, velocity) => Math.abs(offset) * velocity;
 
 function Carousel({ autoSlide = false, autoSlideInterval = 3000, items }) {
   const [[index, direction], setIndex] = useState([0, 0]);
+  const [isPlaying, setIsPlaying] = useState(autoSlide);
+  const [isHovered, setIsHovered] = useState(false);
   const currentIndex = wrap(0, items.length, index);
 
   const paginate = useCallback((dir) => {
     setIndex(([prevIndex]) => [prevIndex + dir, dir]);
   }, []);
 
+  const togglePlayPause = () => {
+    setIsPlaying(!isPlaying);
+  };
+
   useEffect(() => {
-    if (!autoSlide) return;
-    const interval = setInterval(() => paginate(1), autoSlideInterval);
+    if (!isPlaying || isHovered) return;
+    const interval = setInterval(() => paginate(1), autoSlideInterval);
     return () => clearInterval(interval);
-  }, [autoSlide, autoSlideInterval, paginate]);
+  }, [isPlaying, isHovered, autoSlideInterval, paginate]);
 
   return (
-    <div className="sm:[300px] relative h-[400px] max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg md:h-[300px]">
+    <div 
+      className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-white shadow-xl md:h-[350px]"
+      onMouseEnter={() => setIsHovered(true)}
+      onMouseLeave={() => setIsHovered(false)}
+    >
       <AnimatePresence initial={false} custom={direction}>
         <motion.div
           key={index}
@@ -1,7 +1,7 @@
           variants={variants}
           initial="enter"
           animate="center"
           exit="exit"
-          transition={{ duration: 0.7, ease: "easeInOut" }}
+          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
           drag="x"
           dragConstraints={{ left: 0, right: 0 }}
           dragElastic={0.1}
           onDragEnd={(e, { offset, velocity }) => {
             const swipe = swipePower(offset.x, velocity.x);
             if (swipe < -swipeConfidenceThreshold) paginate(1);
             else if (swipe > swipeConfidenceThreshold) paginate(-1);
           }}
           className="absolute inset-0 h-full w-full"
         >
           <CarouselItem item={items[currentIndex]} />
         </motion.div>
       </AnimatePresence>
 
       {/* Navigation Buttons */}
-      <button
-        onClick={() => paginate(-1)}
-        className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50"
-        aria-label="Previous"
-      >
-        <ChevronLeft size={24} />
-      </button>
-      <button
-        onClick={() => paginate(1)}
-        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50"
-        aria-label="Next"
-      >
-        <ChevronRight size={24} />
-      </button>
+      <div className={`absolute inset-y-0 left-0 flex items-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
+        <button
+          onClick={() => paginate(-1)}
+          className="ml-4 rounded-full bg-black/40 p-3 text-white backdrop-blur-md transition-all duration-200 hover:bg-black/60 hover:scale-110"
+          aria-label="Previous slide"
+        >
+          <ChevronLeft size={20} />
+        </button>
+      </div>
+      
+      <div className={`absolute inset-y-0 right-0 flex items-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
+        <button
+          onClick={() => paginate(1)}
+          className="mr-4 rounded-full bg-black/40 p-3 text-white backdrop-blur-md transition-all duration-200 hover:bg-black/60 hover:scale-110"
+          aria-label="Next slide"
+        >
+          <ChevronRight size={20} />
+        </button>
+      </div>
+
+      {/* Play/Pause Button */}
+      {autoSlide && (
+        <div className={`absolute top-4 right-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
+          <button
+            onClick={togglePlayPause}
+            className="rounded-full bg-black/40 p-2 text-white backdrop-blur-md transition-all duration-200 hover:bg-black/60"
+            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
+          >
+            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
+          </button>
+        </div>
+      )}
 
       {/* Dots */}
-      <div className="absolute right-0 bottom-4 left-0 flex justify-center gap-2">
+      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
         {items.map((_, i) => (
           <button
             key={i}
             onClick={() => setIndex([i, i > currentIndex ? 1 : -1])}
-            className={`h-2 w-2 rounded-full transition-all ${
-              i === currentIndex ? "w-5 bg-gray-900" : "bg-gray-900/50"
+            className={`h-2 rounded-full transition-all duration-300 ${
+              i === currentIndex 
+                ? "w-8 bg-white shadow-lg" 
+                : "w-2 bg-white/60 hover:bg-white/80"
             }`}
             aria-label={`Slide ${i + 1}`}
           />
         ))}
       </div>
+
+      {/* Progress Bar */}
+      {isPlaying && !isHovered && (
+        <div className="absolute bottom-0 left-0 h-1 w-full bg-black/20">
+          <motion.div
+            className="h-full bg-blue-600"
+            initial={{ width: "0%" }}
+            animate={{ width: "100%" }}
+            transition={{ duration: autoSlideInterval / 1000, ease: "linear" }}
+            key={currentIndex}
+          />
+        </div>
+      )}
     </div>
   );
 }
 
 export default Carousel;