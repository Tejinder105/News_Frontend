import React, { useEffect, useState } from "react";
import { FileText, CircleCheck, Clock, Eye, RefreshCw, CircleAlert } from "lucide-react";
import StatsCards from "../../Components/Admin/StatsCards";
import adminService from "../../Services/adminService";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, NavLink } from "react-router-dom";

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

const getActivityIcon = (type) => {
  switch (type) {
    case "publish":
      return {
        icon: <FileText className="h-4 w-4" />,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
      };
    case "update":
      return {
        icon: <CircleCheck className="h-4 w-4" />,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
      };
    case "draft":
      return {
        icon: <Clock className="h-4 w-4" />,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      };
    default:
      return {
        icon: <FileText className="h-4 w-4" />,
        iconBg: "bg-gray-50",
        iconColor: "text-gray-600",
      };
  }
};

const ActivityItem = ({ activity }) => {
  const activityStyle = getActivityIcon(activity.type);

  return (
    <div className="flex items-start space-x-3 rounded-lg bg-gray-50 p-3 transition-colors duration-150 hover:bg-gray-100">
      <div
        className={`${activityStyle.iconBg} flex-shrink-0 rounded-full p-1.5`}
      >
        <div className={activityStyle.iconColor}>{activityStyle.icon}</div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center justify-between">
          <p className=" text-sm font-medium text-gray-900">
            {activity.title}
          </p>
          <span className="ml-2 flex-shrink-0 text-xs text-gray-500">
            {activity.timestamp}
          </span>
        </div>
        <p className="mb-0.5 text-sm text-gray-600">
          {activity.description}
        </p>
        {activity.author && (
          <p className="truncate text-xs text-gray-500">by {activity.author}</p>
        )}
      </div>
    </div>
  );
};

function Dashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
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
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");

      setStats(getStatsData(null));
      setActivities([]);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome to Singh Channel Admin Panel
                </p>
                <p className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
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
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                    <span className="text-sm font-bold text-white">A</span>
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

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CircleAlert />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <section className="mb-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h2>
                <NavLink to="/admin/allarticles" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  View all
                </NavLink>
              </div>
            </div>
            <ul className="p-4">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex animate-pulse items-center space-x-3 p-3"
                    >
                      <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-3 w-3/4 rounded bg-gray-200"></div>
                        <div className="h-2 w-1/2 rounded bg-gray-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
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
