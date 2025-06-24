import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion, wrap } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarouselItem from "./CarouselItem";

const items = [
  {
    tag: "Agriculture",
    image: "/agriculture.jpg",
    headline:
      "India Pushes Smart Farming to Tackle Climate Change and Food Security",
    description:
      "In response to rising climate concerns, India is rolling out smart farming initiatives powered by AI, IoT, and satellite data to support farmers and improve crop yields.",
    link: "https://en.wikipedia.org/wiki/Agriculture",
    time: "2 hours ago",
    author: "Ananya Verma",
  },
  {
    tag: "Technology",
    image: "/technology.jpg",
    headline:
      "AI Breakthrough: New Model Solves Complex Math Problems with High Accuracy",
    description:
      "MIT researchers have developed an AI system capable of solving advanced math problems with reasoning capabilities similar to graduate-level students.",
    link: "https://en.wikipedia.org/wiki/Technology",
    time: "1 hour ago",
    author: "Rahul Mehta",
  },
  {
    tag: "Environment",
    image: "/environment.jpeg",
    headline: "Heatwave Grips Northern India as Temperatures Soar Beyond 48°C",
    description:
      "A severe heatwave is sweeping across northern India, breaching 48°C in some areas. Authorities are urging residents to stay indoors.",
    link: "https://en.wikipedia.org/wiki/Environment",
    time: "30 minutes ago",
    author: "Nidhi Kapoor",
  },
  {
    tag: "Health",
    image: "/health.jpg",
    headline:
      "WHO Approves First-Ever Vaccine for Dengue Fever in Endemic Countries",
    description:
      "WHO has approved a new dengue vaccine with up to 80% effectiveness. Distribution will begin later this year in South Asia and Latin America.",
    link: "https://en.wikipedia.org/wiki/Health",
    time: "3 hours ago",
    author: "Dr. Ramesh Iyer",
  },
  {
    tag: "Education",
    image: "/education.jpg",
    headline:
      "NEP 2020 Implementation: Indian Schools Introduce Coding and AI from Grade 6",
    description:
      "Schools across India are integrating coding, robotics, and AI from Grade 6 onwards under NEP 2020 to prepare students for a digital future.",
    link: "https://en.wikipedia.org/wiki/Education",
    time: "4 hours ago",
    author: "Priya Nair",
  },
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    zIndex: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    zIndex: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

function Carousel({ autoSlide = true, autoSlideInterval = 3000 }) {
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
<div className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-lg">      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) paginate(1);
            else if (swipe > swipeConfidenceThreshold) paginate(-1);
          }}
          className="absolute inset-0 flex h-full w-full items-center justify-center p-2"
        >
          <CarouselItem item={items[currentIndex]} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={() => paginate(-1)}
        className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50"
        aria-label="Previous"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50"
        aria-label="Next"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute right-0 bottom-4 left-0 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex([i, i > currentIndex ? 1 : -1])}
            className={`h-2 w-2 rounded-full transition-all ${
              i === currentIndex ? "w-4 bg-white" : "bg-white/50"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
