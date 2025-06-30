import { FileText } from "lucide-react";
import React from "react";

function StatsCards({data}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{data.name}</p>
          <p className="text-2xl font-bold text-gray-900">{data.value}</p>
        </div>
        <div className={`h-12 w-12 ${data.bgcolor} rounded-lg flex items-center justify-center`}>
            {data.icon}
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
