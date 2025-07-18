import React from "react";
import Button from "../Ui/Button";

const  GeminiSuggestions = ({
  analysis,
  onApplyHeadline,
  onApplySummary,
  onApplyContent,
  onApplyTranslation,
  onApplyTags,
  isAnalyzing,
}) => {
  if (isAnalyzing) {
    return (
      <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span className="text-blue-800">Analyzing content with AI...</span>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="mb-4 space-y-4">
      {/* Headline Suggestion */}
      {analysis.headline && (
        <SuggestionCard
          title="AI Suggested Headline"
          content={analysis.headline}
          onApply={onApplyHeadline}
          bgColor="bg-blue-50"
          borderColor="border-blue-200"
          textColor="text-blue-800"
          buttonColor="bg-blue-500 hover:bg-blue-600"
        />
      )}

      {/* Summary Suggestion */}
      {analysis.summary && (
        <SuggestionCard
          title="AI Suggested Summary"
          content={analysis.summary}
          onApply={onApplySummary}
          bgColor="bg-green-50"
          borderColor="border-green-200"
          textColor="text-green-800"
          buttonColor="bg-green-500 hover:bg-green-600"
        />
      )}

      {/* Content Refinement */}
      {analysis.refinedContent && (
        <SuggestionCard
          title="AI Refined Content"
          content={analysis.refinedContent}
          onApply={onApplyContent}
          bgColor="bg-yellow-50"
          borderColor="border-yellow-200"
          textColor="text-yellow-800"
          buttonColor="bg-yellow-500 hover:bg-yellow-600"
          isLongContent={true}
        />
      )}

      {/* Hindi Translation */}
      {analysis.hindiTranslation && (
        <SuggestionCard
          title="Hindi Translation"
          content={analysis.hindiTranslation}
          onApply={onApplyTranslation}
          bgColor="bg-orange-50"
          borderColor="border-orange-200"
          textColor="text-orange-800"
          buttonColor="bg-orange-500 hover:bg-orange-600"
          isLongContent={true}
        />
      )}

      {/* Tags Suggestion */}
      {analysis.tags && analysis.tags.length > 0 && (
        <div className="rounded-md border border-indigo-200 bg-indigo-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-indigo-800">
              AI Suggested Tags:
            </p>
            <Button
              type="button"
              onClick={onApplyTags}
              className="rounded bg-indigo-500 px-3 py-1 text-xs text-white hover:bg-indigo-600"
            >
              Apply All
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {analysis.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Scores and Suggestions */}
      {(analysis.seoScore ||
        analysis.readabilityScore ||
        analysis.suggestions) && (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
          <p className="mb-2 text-sm font-medium text-gray-800">
            AI Analysis Report:
          </p>
          <div className="space-y-2">
            {analysis.seoScore && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">SEO Score:</span>
                <span className="text-sm font-medium text-gray-800">
                  {analysis.seoScore}/100
                </span>
              </div>
            )}
            {analysis.readabilityScore && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Readability Score:
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {analysis.readabilityScore}/100
                </span>
              </div>
            )}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div>
                <p className="mb-1 text-sm text-gray-600">
                  Improvement Suggestions:
                </p>
                <ul className="space-y-1 text-xs text-gray-700">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-blue-500">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiSuggestions;

const SuggestionCard = ({
  title,
  content,
  onApply,
  bgColor,
  borderColor,
  textColor,
  buttonColor,
  isLongContent = false,
}) => (
  <div className={`p-3 ${bgColor} border ${borderColor} rounded-md`}>
    <div className="mb-2 flex items-start justify-between">
      <p className={`text-sm font-medium ${textColor}`}>{title}:</p>
      <Button
        type="button"
        onClick={onApply}
        className={`${buttonColor} rounded px-3 py-1 text-xs text-white`}
      >
        Apply
      </Button>
    </div>
    <div
      className={`text-sm ${textColor.replace("800", "600")} ${isLongContent ? "max-h-40 overflow-y-auto" : ""}`}
    >
      {content}
    </div>
  </div>
);
