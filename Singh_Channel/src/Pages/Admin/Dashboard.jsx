import React, { useEffect, useState } from "react";
import { FileText, CircleCheck, Clock, Eye, RefreshCw } from "lucide-react";
import StatsCards from "../../Components/Admin/StatsCards";

const getStatsData = () => [
  {
    name: "Total Articles",
    value: "1,234",
    icon: <FileText className="text-blue-600" />,
    bgcolor: "bg-blue-100",
  },
  {
    name: "Published Articles",
    value: "987",
    icon: <CircleCheck className="text-green-600" />,
    bgcolor: "bg-green-100",
  },
  {
    name: "Draft",
    value: "247",
    icon: <Clock className="text-yellow-600" />,
    bgcolor: "bg-yellow-100",
  },
  {
    name: "Total Views",
    value: "15.2K",
    icon: <Eye className="text-purple-600" />,
    bgcolor: "bg-purple-100",
  },
];

const getRecentActivities = () => [
  {
    id: 1,
    type: "publish",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    icon: <FileText className="h-4 w-4" />,
    title: "New article published",
    description: "Latest Technology Trends in 2024",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "update",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    icon: <CircleCheck className="h-4 w-4" />,
    title: "Article updated",
    description: "Agriculture News Update",
    timestamp: "4 hours ago",
  },
  {
    id: 3,
    type: "draft",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    icon: <Clock className="h-4 w-4" />,
    title: "Draft saved",
    description: "Education Policy Changes",
    timestamp: "6 hours ago",
  },
];

const ActivityItem = ({ activity }) => {
  return (
    <div className="flex items-start space-x-4 rounded-lg bg-gray-50 p-4 transition-colors duration-150 hover:bg-gray-100">
      <div className={`${activity.iconBg} flex-shrink-0 rounded-full p-2`}>
        <div className={activity.iconColor}>{activity.icon}</div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
          <p className="truncate text-sm font-medium text-gray-900">
            {activity.title}
          </p>
          <span className="ml-2 flex-shrink-0 text-xs text-gray-500">
            {activity.timestamp}
          </span>
        </div>
        <p className="mb-1 truncate text-sm text-gray-600">
          {activity.description}
        </p>
      </div>
    </div>
  );
};

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(getStatsData());
  const [activities, setActivities] = useState([]);
  const [lastupdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStats(getStatsData());
      setActivities(getRecentActivities());
      setLastUpdated(new Date());
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStats(getStatsData());
      setActivities(getRecentActivities());
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome to Singh Channel Admin Panel
                </p>
                <p className="text-sm text-gray-500">
                  Last updated: {lastupdated.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-lg font-bold text-white">A</span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Stats Cards */}
          <section className="mb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {isLoading
                ? stats.map((item, idx) => (
                    <StatsCards stat={item} key={idx} isLoading={true} />
                  ))
                : stats.map((item, idx) => (
                    <StatsCards stat={item} key={idx} isLoading={false} />
                  ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Activity
                </h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  View all
                </button>
              </div>
            </div>
            <ul className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex animate-pulse items-center space-x-4 p-4"
                    >
                      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                        <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
