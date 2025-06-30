import React from "react";
import { FileText, CircleCheck, Clock, Eye } from "lucide-react";
import StatsCards from "../../Components/Admin/StatsCards";

const stats = [
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

const activities = [
  {
    iconBg: "bg-blue-100",
    iconSvg: (
      <svg
        className="h-5 w-5 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    ),
    title: "New article published",
    desc: '"Latest Technology Trends in 2024" was published 2 hours ago',
  },
  {
    iconBg: "bg-green-100",
    iconSvg: (
      <svg
        className="h-5 w-5 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Article updated",
    desc: '"Agriculture News Update" was modified 4 hours ago',
  },
  {
    iconBg: "bg-yellow-100",
    iconSvg: (
      <svg
        className="h-5 w-5 text-yellow-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Draft saved",
    desc: '"Education Policy Changes" draft was saved 6 hours ago',
  },
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to Singh Channel Admin Panel</p>
        </header>

        {/* Stats Cards */}
        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, idx) => (
            <StatsCards data={item} key={idx} />
          ))}
        </section>

        {/* Recent Activity */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Recent Activity
          </h2>
          <ul className="space-y-4">
            {activities.map((activity, idx) => (
              <li
                key={idx}
                className="flex items-center space-x-4 rounded-lg bg-gray-50 p-4"
              >
                <div
                  className={`h-10 w-10 ${activity.iconBg} flex items-center justify-center rounded-full`}
                >
                  {activity.iconSvg}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500">{activity.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
