import React, { useEffect, useRef } from "react";

// Intersection Observer hook for animations
export const useInViewAnimation = (threshold = 0.1) => {
    const ref = useRef();
    const [isInView, setIsInView] = React.useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    return [ref, isInView];
};

// Animated wrapper component
export const AnimatedWrapper = ({ children, className = "", delay = 0 }) => {
    const [ref, isInView] = useInViewAnimation();

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${isInView
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// Reading progress component
export const ReadingProgress = () => {
    const [progress, setProgress] = React.useState(0);

    useEffect(() => {
        let ticking = false;

        const updateProgress = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentProgress = (window.pageYOffset / totalHeight) * 100;
            setProgress(Math.min(currentProgress, 100));
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateProgress);
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Initial calculation
        updateProgress();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 z-[100] h-1 w-full bg-gray-200/20">
            <div
                className="h-full bg-gradient-to-r from-red-600 to-red-600 transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

// Parallax image component
export const ParallaxImage = ({ src, alt, className = "" }) => {
    const [offset, setOffset] = React.useState(0);
    const ref = useRef();

    useEffect(() => {
        let ticking = false;

        const updateParallax = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const viewHeight = window.innerHeight;

                // Only animate if in view to save resources
                if (rect.top < viewHeight && rect.bottom > 0) {
                    const scrolled = window.pageYOffset;
                    const parallax = scrolled * 0.5;
                    setOffset(parallax);
                }
            }
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                style={{ transform: `translateY(${offset * 0.1}px)` }}
            />
        </div>
    );
};

export default {
    useInViewAnimation,
    AnimatedWrapper,
    ReadingProgress,
    ParallaxImage,
};
