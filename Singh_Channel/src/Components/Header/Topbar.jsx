import React from "react";
import { useMemo } from "react";
function Topbar() {
    const date = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    const formattedDate = useMemo(() => {
        const date = new Date();
        return date.toLocaleDateString("en-US", options);
    }, []);
    return (
        <div className="bg-black w-full flex justify-between items-center p-1 text-[12px]">
            <div className="text-white font-sans">
                <p>{formattedDate}</p>
            </div>
            <div className="flex text-white font-sans gap-2">
                <button>English</button>
                <button>हिंदी</button>
                <button>ਪੰਜਾਬੀ</button>
            </div>
        </div>
    );
}
export default Topbar;
