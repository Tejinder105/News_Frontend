import React, { useEffect, useState } from "react";
import { FileText, CircleCheck, Clock, Eye, RefreshCw, CircleAlert } from "lucide-react";
import StatsCards from "../../Components/Admin/StatsCards";
import adminService from "../../Services/adminService";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, NavLink } from "react-router-dom";
import AnalyticsChart from "../../Components/Admin/AnalyticsChart";
import QuickActions from "../../Components/Admin/QuickActions";
import ActivityItem from "../../Components/Admin/ActivityItem";

const getStatsData = (statsData) => {
  if (!statsData) {
    return [
      {
        name: "Total Articles",
        value: "0",
        icon: <FileText className="text-blue-600" />,
        bgcolor: "bg-blue-100",
      },
      {
        name: "Published Articles",
        value: "0",
        icon: <CircleCheck className="text-green-600" />,
        bgcolor: "bg-green-100",
      },
      {
        name: "Draft Articles",
        value: "0",
        icon: <Clock className="text-yellow-600" />,
        bgcolor: "bg-yellow-100",
      },
      {
        name: "Total Views",
        value: "0",
        icon: <Eye className="text-purple-600" />,
        bgcolor: "bg-purple-100",
      },
    ];
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return [
    {
      name: "Total Articles",
      value: formatNumber(statsData.totalArticles || 0),
      icon: <FileText className="text-blue-600" />,
      bgcolor: "bg-blue-100",
    },
    {
      name: "Published Articles",
      value: formatNumber(statsData.publishedArticles || 0),
      icon: <CircleCheck className="text-green-600" />,
      bgcolor: "bg-green-100",
    },
    {
      name: "Draft Articles",
      value: formatNumber(statsData.draftArticles || 0),
      icon: <Clock className="text-yellow-600" />,
      bgcolor: "bg-yellow-100",
    },
    {
      name: "Total Views",
      value: formatNumber(statsData.totalViews || 0),
      icon: <Eye className="text-purple-600" />,
      bgcolor: "bg-purple-100",
    },
  ];
};


function Dashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getAccessTokenSilently();
      const dashboardData = await adminService.getDashboardData(token);

      setStats(getStatsData(dashboardData.stats));
      setActivities(dashboardData.activities || []);
      setAnalyticsData(dashboardData.analytics || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");

      setStats(getStatsData(null));
      setActivities([]);
      setAnalyticsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    loadDashboardData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Dashboard
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Overview & Analytics</span>
                  <span>•</span>
                  <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </header>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center">
                <CircleAlert className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
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

          {/* Main Content Grid */}
          <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Analytics Chart - Takes up 2 columns on large screens */}
            <div className="lg:col-span-2">
              <AnalyticsChart data={analyticsData} isLoading={isLoading} />
            </div>

            {/* Quick Actions - Takes up 1 column */}
            <div className="lg:col-span-1">
              <QuickActions />
            </div>
          </div>

          {/* Recent Activity */}
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h2>
                <NavLink
                  to="/admin/allarticles"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View all activity
                </NavLink>
              </div>
            </div>
            <div className="p-0">
              {isLoading ? (
                <div className="space-y-4 p-6">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex animate-pulse items-center space-x-4"
                    >
                      <div className="h-10 w-10 rounded-full bg-gray-100"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-gray-100"></div>
                        <div className="h-3 w-1/2 rounded bg-gray-100"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {activities.map((activity) => (
                    <div key={activity.id} className="px-6 py-3 transition-colors hover:bg-gray-50">
                      <ActivityItem activity={activity} />
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <div className="px-6 py-8 text-center text-gray-500">
                      No recent activity found
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
