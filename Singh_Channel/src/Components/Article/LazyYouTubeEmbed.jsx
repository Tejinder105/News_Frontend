import React, { useRef, useEffect, useState } from "react";

const LazyYouTubeEmbed = ({ videoId }) => {
	const containerRef = useRef(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setVisible(true);
						observer.disconnect();
					}
				});
			},
			{ rootMargin: "200px" }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

	return (
		<div ref={containerRef} className="relative h-full w-full">
			{visible ? (
				<iframe
					className="h-full w-full"
					src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
				/>
			) : (
				<button
					type="button"
					className="group relative h-full w-full overflow-hidden"
					aria-label="Load video"
					onClick={() => setVisible(true)}
				>
					<img
						src={thumbnail}
						alt="Video thumbnail"
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						loading="lazy"
					/>
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110">
							▶
						</span>
					</div>
				</button>
			)}
		</div>
	);
};

export default LazyYouTubeEmbed;
