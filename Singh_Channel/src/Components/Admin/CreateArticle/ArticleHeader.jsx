import React from "react";
import { ArrowLeft, AlertCircle, Save, Eye, Settings } from "lucide-react";

// Status badge component
const StatusBadge = ({ status, className = "" }) => {
  const statusConfig = {
    draft: { bg: "bg-yellow-100", text: "text-yellow-800", icon: AlertCircle },
    published: { bg: "bg-green-100", text: "text-green-800", icon: Eye },
  };

  const config = statusConfig[status] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text} ${className}`}
    >
      <Icon className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ArticleHeader = ({
  post,
  isDirty,
  loading,
  showSidebar,
  setShowSidebar,
  onSave,
  onPreview,
  buttonClass,
}) => {
  const primaryButtonClass = `${buttonClass} bg-blue-600 text-white hover:bg-blue-700`;
  const secondaryButtonClass = `${buttonClass} bg-gray-100 text-gray-700 hover:bg-gray-200`;

  return (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between sm:h-16">
          {/* Left Section */}
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 sm:p-2"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold text-gray-900 sm:text-xl">
                {post ? "Edit Article" : "Create Article"}
              </h1>
              {post && (
                <div className="mt-1 hidden items-center gap-2 sm:flex">
                  <StatusBadge
                    status={post.status || "draft"}
                    className="text-xs"
                  />
                  <span className="truncate text-xs text-gray-500">
                    Updated:{" "}
                    {new Date(
                      post.updatedAt || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-3">
            {/* Unsaved changes indicator */}
            {isDirty && (
              <div className="flex items-center gap-1 text-xs text-amber-600 sm:gap-2 sm:text-sm">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Unsaved changes</span>
                <span className="sm:hidden">Unsaved</span>
              </div>
            )}

            {/* Mobile: Show only essential buttons */}
            <div className="flex items-center gap-1.5 sm:hidden">
              <button
                type="button"
                onClick={() => setShowSidebar(!showSidebar)}
                className="rounded-lg p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Toggle sidebar"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={loading}
                className={`${primaryButtonClass} px-3 py-1.5 text-xs`}
                aria-label="Save article"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Desktop: Show all buttons */}
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={onPreview}
                className={`${secondaryButtonClass} text-sm`}
                disabled={loading}
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={loading}
                className={`${primaryButtonClass} text-sm`}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {post ? "Updating..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {post ? "Update Article" : "Publish Article"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleHeader;
