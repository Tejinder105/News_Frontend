import React from "react";

function Breaking() {
  const BreakingNews = [
    "रतिया में आज शाम को बिजली की आपूर्ति 4 घंटे के लिए बाधित रहेगी",
    "फतेहाबाद जिले में नई कृषि योजना का शुभारंभ",
    "रतिया नगर पालिका की बैठक कल आयोजित की जाएगी",
  ];
  return (
    <div className="bg-black py-1 text-white">
      <div className="relative mx-auto flex max-w-7xl items-center overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="z-10 bg-black pr-3">
          <span className="inline-block rounded-full bg-red-600 px-3 py-0.5 text-xs font-bold tracking-wider uppercase">
            BREAKING
          </span>
        </div>

        <div className="animate-marquee absolute right-0 whitespace-nowrap">
          {BreakingNews.map((news, index) => (
            <span key={index} className="px-3 text-sm font-semibold">
              <span className="mx-2 text-red-400">•</span>
              {news}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Breaking;
