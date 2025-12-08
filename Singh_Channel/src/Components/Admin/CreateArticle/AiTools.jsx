import React from 'react';
import { Spinner } from '/src/Components';
import { Lock, Languages, Sparkles, Wand2, Tags, ChevronRight } from 'lucide-react';

const AiTools = ({
  translating,
  isAnalyzing,
  isAuthenticated,
  isAuthLoading,
  handleGenerateTranslations,
  handleAnalyzeContent,
  handleGenerateHeadlines,
  handleGenerateTags
}) => {
  // Show authentication loading state
  if (isAuthLoading) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <Spinner size="sm" />
        <span className="text-sm text-gray-600">Connecting to AI Services...</span>
      </div>
    );
  }

  // Show authentication required message
  if (!isAuthenticated) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="rounded-full bg-red-100 p-2">
          <Lock size={18} className="text-red-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-red-900">AI Features Locked</h3>
          <p className="text-xs text-red-700">Please log in to access AI generation tools.</p>
        </div>
      </div>
    );
  }

  const ToolButton = ({ label, icon: Icon, onClick, loading, loadingText, colorClass = "text-gray-700 hover:text-blue-600 hover:bg-blue-50" }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-50 ${colorClass}`}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <Icon size={18} className={`transition-colors ${loading ? '' : ''}`} />
      )}
      <span>{loading ? loadingText : label}</span>
    </button>
  );

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-blue-500" />
          <h3 className="font-semibold text-gray-800">AI Assistant</h3>
        </div>
        <div className="text-xs text-gray-400">Powered by Gemini</div>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-2">
        <ToolButton
          label="Translate All"
          icon={Languages}
          onClick={handleGenerateTranslations}
          loading={translating}
          loadingText="Translating..."
        />

        <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

        <ToolButton
          label="Analyze Content"
          icon={Wand2}
          onClick={handleAnalyzeContent}
          loading={isAnalyzing}
          loadingText="Analyzing..."
        />

        <ToolButton
          label="Suggest Headlines"
          icon={TypeIcon}
          onClick={handleGenerateHeadlines}
          loading={isAnalyzing}
          loadingText="Thinking..."
        />

        <ToolButton
          label="Generate Tags"
          icon={Tags}
          onClick={handleGenerateTags}
          loading={isAnalyzing}
          loadingText="Tagging..."
        />
      </div>
    </div>
  );
};

// Helper icon component since 'Type' might conflict with TS types or be reserved
const TypeIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 7V4h16v3" />
    <path d="M9 20h6" />
    <path d="M12 4v16" />
  </svg>
);

export default AiTools;
