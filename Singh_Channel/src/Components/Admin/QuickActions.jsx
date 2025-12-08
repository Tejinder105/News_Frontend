import React from "react";
import { PenTool, Calendar, ExternalLink, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import Panel from "../Ui/Panel";

const QuickActions = () => {
    const actions = [
        {
            title: "Write Article",
            icon: <PenTool size={20} />,
            link: "/admin/createarticles",
            color: "bg-blue-600",
            textColor: "text-white",
            hover: "hover:bg-blue-700",
        },

        {
            title: "Site Settings",
            icon: <Settings size={20} />,
            link: "/admin/settings",
            color: "bg-gray-100",
            textColor: "text-gray-700",
            hover: "hover:bg-gray-200",
        },
    ];

    return (
        <Panel className="h-full">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        to={action.link}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${action.textColor === "text-white"
                            ? `${action.color} ${action.hover} shadow-sm`
                            : `${action.color} ${action.textColor} ${action.hover}`
                            }`}
                    >
                        <div className={`${action.textColor === "text-white" ? "text-white" : ""}`}>
                            {action.icon}
                        </div>
                        <span className={`font-medium ${action.textColor}`}>
                            {action.title}
                        </span>
                    </Link>
                ))}

                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3 text-green-700 transition-all duration-200 hover:bg-green-100"
                >
                    <ExternalLink size={20} />
                    <span className="font-medium">View Live Site</span>
                </a>
            </div>
        </Panel>
    );
};

export default QuickActions;
