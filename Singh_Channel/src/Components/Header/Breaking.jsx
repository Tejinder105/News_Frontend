import React from "react";

function Breaking() {
    const BreakingNews = [
        "रतिया में आज शाम को बिजली की आपूर्ति 4 घंटे के लिए बाधित रहेगी",
        "फतेहाबाद जिले में नई कृषि योजना का शुभारंभ",
        "रतिया नगर पालिका की बैठक कल आयोजित की जाएगी",
    ];
    return (
        <div className="bg-black py-1 text-white">
            <div className="relative flex max-w-7xl items-center overflow-hidden">
                <div className="z-10 bg-black">
                    <span className="z-10 rounded-full bg-red-700 px-3 text-sm font-semibold">
                        BREAKING
                    </span>
                </div>

                <div className="animate-marquee absolute right-0 whitespace-nowrap">
                    {BreakingNews.map((news, index) => (
                        <span key={index} className="text-xm px-3 font-medium">
                            <span className="mx-3 text-red-500">•</span>
                            {news}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Breaking;
