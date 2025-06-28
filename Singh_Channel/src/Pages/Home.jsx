import { ArrowRight } from "lucide-react";
import React from "react";
import { Carousel, Weather, CardAd, Card } from "../Components";
import { items } from "../carousel.js";
import { Link } from "react-router-dom";
import { newsItem } from "../NewItem.js";

const adItem = [
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

function Home() {
  return (
    <div className="mx-auto max-w-7xl bg-slate-100 px-2 py-3 sm:px-4 lg:px-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="space-y-4 md:col-span-2 lg:col-span-3">
          <Carousel items={items} />

          <div className="flex items-center justify-between border-b border-slate-300 pb-2">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Top Stories
            </h1>
            <Link
              to="#"
              className="flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 sm:text-base"
            >
              Read more <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {newsItem.map((item, index) => (
              <Card
                key={index}
                id={item.id}
                title={item.title}
                description={item.description}
                timeAgo={item.timeAgo}
                imageUrl={item.imageUrl}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:col-span-1">
          <Weather />
          <div>
            <h2 className="border-b border-slate-300 pb-2 text-lg font-semibold text-gray-900 sm:text-xl">
              Advertisements
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
              {adItem.map((ad, idx) => (
                <CardAd key={idx} data={ad} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
