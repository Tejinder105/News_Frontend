import React from 'react';
import { Button, Spinner } from '/src/Components';
import { Globe, Bot, Sparkle, Tag, Lock } from 'lucide-react';

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
  const buttonClass = "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:shadow-md";

  // Show authentication loading state
  if (isAuthLoading) {
    return (
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <Spinner size="sm" />
        <span className="text-sm text-gray-600">Checking authentication...</span>
      </div>
    );
  }

  // Show authentication required message
  if (!isAuthenticated) {
    return (
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
        <Lock size={16} className="text-red-500" />
        <span className="text-sm text-red-600">Please log in to use AI features</span>
      </div>
    );
  }

  const buttons = [
    {
      label: 'Translate all',
      icon: <Globe size={16} />,
      handler: handleGenerateTranslations,
      loading: translating,
      loadingText: 'Translating...',
      className: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    {
      label: 'Analyze',
      icon: <Bot size={16} />,
      handler: handleAnalyzeContent,
      loading: isAnalyzing,
      loadingText: 'Analyzing...',
      className: 'bg-indigo-600 text-white hover:bg-indigo-700',
    },
    {
      label: 'Headline',
      icon: <Sparkle size={16} />,
      handler: handleGenerateHeadlines,
      loading: isAnalyzing,
      loadingText: 'Generating...',
      className: 'bg-purple-600 text-white hover:bg-purple-700',
    },
    {
      label: 'Tags',
      icon: <Tag size={16} />,
      handler: handleGenerateTags,
      loading: isAnalyzing,
      loadingText: 'Generating...',
      className: 'bg-teal-600 text-white hover:bg-teal-700',
    },
  ];

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {buttons.map((btn, index) => (
        <button
          key={index}
          type="button"
          onClick={btn.handler}
          disabled={btn.loading}
          className={`${buttonClass} ${btn.className} disabled:opacity-50`}
        >
          {btn.loading ? (
            <>
              <Spinner size="sm" /> {btn.loadingText}
            </>
          ) : (
            <>
              {btn.icon} {btn.label}
            </>
          )}
        </button>
      ))}
    </div>
  );
};

export default AiTools;
