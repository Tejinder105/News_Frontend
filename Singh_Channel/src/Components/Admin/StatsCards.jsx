import React from "react";

function StatsCards({stat, isLoading}) {

  if(isLoading){
    return(
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
       <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"/>
            <div className="w-12 h-4 bg-gray-200 rounded"/>
          </div>
          <div className="w-16 h-8 bg-gray-200 rounded mb-2"/>
          <div className="w-24 h-4 bg-gray-200 rounded"/>
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{stat.name}</p>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
        </div>
        <div
          className={`h-12 min-h-[48px] w-12 min-w-[48px] ${stat.bgcolor} flex items-center justify-center rounded-lg`}
        >
          {stat.icon}
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
