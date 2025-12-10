import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion, wrap } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarouselItem from "./CarouselItem";
import Button from "./Button";

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0.5,
    scale: 0.95,
    zIndex: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0.5,
    scale: 0.95,
    zIndex: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

function Carousel({ autoSlide = true, autoSlideInterval = 6000, items }) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  const [[index, direction], setIndex] = useState([0, 0]);
  const currentIndex = wrap(0, items.length, index);

  const paginate = useCallback((dir) => {
    setIndex(([prevIndex]) => [prevIndex + dir, dir]);
  }, []);

  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(() => paginate(1), autoSlideInterval);
    return () => clearInterval(interval);
  }, [autoSlide, autoSlideInterval, paginate]);

  return (
    <div className="relative mx-auto w-full max-w-[1200px] px-4 py-4 sm:px-6 lg:px-8">
      <div className="relative h-[320px] w-full overflow-hidden rounded-xl shadow-xl bg-slate-900 sm:h-auto sm:aspect-video md:h-[400px]">

        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) paginate(1);
              else if (swipe > swipeConfidenceThreshold) paginate(-1);
            }}
            className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
          >
            <CarouselItem item={items[currentIndex]} isActive={true} />
          </motion.div>
        </AnimatePresence>

        {/* Minimalist Controls */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 sm:px-4">
          {/* Left Button (Hidden on Mobile) */}
          <div className="pointer-events-auto hidden sm:block">
            <Button
              variant="overlay"
              onClick={() => paginate(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black hover:scale-110 active:scale-95"
              iconLeft={<ChevronLeft size={24} />}
            />
          </div>
          {/* Right Button (Hidden on Mobile) */}
          <div className="pointer-events-auto hidden sm:block">
            <Button
              variant="overlay"
              onClick={() => paginate(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black hover:scale-110 active:scale-95"
              iconLeft={<ChevronRight size={24} />}
            />
          </div>
        </div>

        {/* Dots Indicators */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex([i, i > currentIndex ? 1 : -1])}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${i === currentIndex ? "bg-white scale-110" : "bg-white/40 hover:bg-white/70"
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

export default Carousel;
