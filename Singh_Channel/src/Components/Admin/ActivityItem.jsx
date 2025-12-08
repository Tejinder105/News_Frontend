import React from "react";
import { FileText, CircleCheck, Clock } from "lucide-react";

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
        <div className="flex items-start space-x-3">
            <div
                className={`${activityStyle.iconBg} flex-shrink-0 rounded-full p-2`}
            >
                <div className={activityStyle.iconColor}>{activityStyle.icon}</div>
            </div>
            <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                    </p>
                    <span className="ml-2 flex-shrink-0 text-xs text-gray-500">
                        {activity.timestamp}
                    </span>
                </div>
                <p className="mb-0.5 text-sm text-gray-600 line-clamp-2">
                    {activity.description}
                </p>
                {activity.author && (
                    <div className="flex items-center text-xs text-gray-500">
                        <span>By {activity.author}</span>
                        <span className="mx-1">•</span>
                        <span className={`${activity.status === 'publish' ? 'text-green-600' : 'text-amber-600'
                            } capitalize`}>
                            {activity.status}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityItem;
