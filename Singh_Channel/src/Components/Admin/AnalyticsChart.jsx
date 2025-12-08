import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import Panel from "../Ui/Panel";

const AnalyticsChart = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <Panel className="h-[300px] w-full animate-pulse bg-gray-100">
                <div className="h-full w-full rounded-lg bg-gray-200" />
            </Panel>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Panel className="flex h-[300px] w-full items-center justify-center text-gray-500">
                No analytics data available
            </Panel>
        );
    }

    return (
        <Panel className="h-[350px] w-full p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Article Performance
            </h3>
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                            itemStyle={{ color: "#1f2937" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#2563eb"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCount)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Panel>
    );
};

export default AnalyticsChart;
