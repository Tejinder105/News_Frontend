import React, { useState, useRef, useEffect, memo } from "react";

/**
 * OptimizedImage component with:
 * - Native lazy loading
 * - Intersection Observer for better control
 * - Low-quality blur placeholder
 * - Smooth fade-in transition
 * - Error handling with fallback
 */
const OptimizedImage = memo(function OptimizedImage({
    src,
    alt,
    className = "",
    placeholderColor = "#e5e7eb", // Tailwind gray-200
    fallbackSrc = "/placeholder-image.jpg",
    ...props
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: "100px", // Start loading 100px before entering viewport
                threshold: 0.01
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
        setIsLoaded(true);
    };

    const imageSrc = hasError ? fallbackSrc : src;

    return (
        <div
            ref={imgRef}
            className={`relative overflow-hidden ${className}`}
            style={{ backgroundColor: placeholderColor }}
        >
            {/* Low-quality placeholder / blur effect */}
            {!isLoaded && (
                <div 
                    className="absolute inset-0 animate-pulse"
                    style={{ 
                        background: `linear-gradient(90deg, ${placeholderColor} 0%, #f3f4f6 50%, ${placeholderColor} 100%)`,
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.5s infinite"
                    }}
                />
            )}

            {/* Actual image - only load when in view */}
            {isInView && (
                <img
                    src={imageSrc}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`h-full w-full object-cover transition-opacity duration-500 ${
                        isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    {...props}
                />
            )}
        </div>
    );
});

export default OptimizedImage;
