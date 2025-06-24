import { div, head } from "motion/react-client";
import React from "react";

const items = [
  {
    name: "Vintage Accessories",
    image: "/shop.jpg",
    tag: "Shop Now",
    headline: "Discover Unique Vintage Accessories",
    description: "Curated vintage accessories to add nostalgia to your style.",
    link: "https://example.com/shop",
  },
  {
    name: "Alpine Top",
    image: "/school.jpg",
    tag: "Learn More",
    headline: "Alpine Top: Elevate Your Style",
    description: "The Alpine Top blends comfort and style for any occasion.",
    link: "https://example.com/alpine-top",
  },
  {
    name: "Punjabi Jutti House",
    image: "/jutti.jpg",
    tag: "Shop Now",
    headline: "Punjabi Jutti House: Traditional Footwear",
    description: "Handcrafted Punjabi Juttis reflecting rich heritage.",
    link: "https://example.com/jutti-house",
  },
  {
    name: "Retro Fashion",
    image: "/clothes.jpg",
    tag: "Shop Now",
    headline: "Retro Fashion: Timeless Styles",
    description: "Classic retro fashion and accessories that never age.",
    link: "https://example.com/retro-fashion",
  },
];

function AdsCard() {
  return (
    <>
      {items.map((item, index) => (
        <div
          key={index}
          className="mx-auto mb-4 w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-md"
        >
          <div className="relative">
            <img
              src={item.image}
              alt={item.name}
              className="h-50 w-full object-cover"
            />
          </div>
          <div className="px-3">
            <h3 className="text-lg font-bold text-gray-900">{item.headline}</h3>
            <p className="mb-2 text-sm text-gray-700">{item.description}</p>
            <div className="mb-2 flex items-center gap-2 justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500">
                  {item.name}
                </span>
                <span className="text-xs text-gray-400">| Sponsored</span>
              </div>
              <div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full border border-black px-4 py-1 text-xs font-semibold text-black transition hover:bg-black hover:text-white"
                >
                  {item.tag}
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default AdsCard;
