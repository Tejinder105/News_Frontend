import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion, wrap } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarouselItem from "./CarouselItem";
import Button from "./Button";
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
  }),
  center: {
    x: 0,
  },
  exit: (direction) => ({
    x: direction < 0 ? "100%" : "-100%",
  }),
};

const swipeConfidenceThreshold = 1000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

function Carousel({ autoSlide = false, autoSlideInterval = 3000, items }) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return (
      <div className="sm:[300px] relative flex h-[400px] max-w-5xl items-center justify-center overflow-hidden rounded-sm bg-white shadow-lg md:h-[300px]">
        <p className="text-gray-500">No featured news available</p>
      </div>
    );
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
    <div className="sm:[300px] relative h-[400px] max-w-5xl overflow-hidden rounded-sm bg-white shadow-lg md:h-[300px]">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: "easeInOut" }}
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
      <Button
        variant="overlay"
        onClick={() => paginate(-1)}
        className="absolute top-1/2 left-2 z-10 -translate-y-1/2"
        iconLeft={<ChevronLeft size={24} />}
      />
      <Button
        variant="overlay"
        onClick={() => paginate(1)}
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2"
        iconLeft={<ChevronRight size={24} />}
      />

      {/* Dots */}
      <div className="absolute right-0 bottom-4 left-0 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex([i, i > currentIndex ? 1 : -1])}
            className={`h-2 w-2 rounded-full transition-all ${i === currentIndex ? "w-5 bg-gray-900" : "bg-gray-900/50"
              }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
