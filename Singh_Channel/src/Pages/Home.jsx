import { Car } from "lucide-react";
import React from "react";
import { Carousel, Weather,AdsCard } from "../Components";

function Home() {
  return (
    <div className="min-h-screen w-full bg-slate-100 p-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-7">
        <div className="sm:col-span-5 h-[300px]">
          <Carousel />
        </div>
        <div className="sm:col-span-2">
          <Weather/>
          <div className="flex overflow-x-auto sm:flex-col">
            <AdsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
