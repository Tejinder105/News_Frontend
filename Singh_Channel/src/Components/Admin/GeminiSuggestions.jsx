import React from "react";
import Button from "../Ui/Button";
import { Lightbulb, Check, FileText, Languages, Tag, BarChart3, ChevronRight } from "lucide-react";

const GeminiSuggestions = ({
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
      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/50 p-6 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <div>
            <h4 className="font-semibold text-blue-900">Analyzing Content</h4>
            <p className="text-sm text-blue-700">Gemini is reviewing your article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="mb-8 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="text-yellow-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">AI Insights</h3>
      </div>

      {/* Headline Suggestion */}
      {analysis.headline && (
        <SuggestionCard
          icon={FileText}
          title="Suggested Headline"
          content={analysis.headline}
          onApply={onApplyHeadline}
          accentColor="blue"
        />
      )}

      {/* Summary Suggestion */}
      {analysis.summary && (
        <SuggestionCard
          icon={FileText}
          title="Suggested Summary"
          content={analysis.summary}
          onApply={onApplySummary}
          accentColor="emerald"
        />
      )}

      {/* Content Refinement */}
      {analysis.refinedContent && (
        <SuggestionCard
          icon={Check}
          title="Refined Content"
          content={analysis.refinedContent}
          onApply={onApplyContent}
          accentColor="amber"
          isLongContent={true}
        />
      )}

      {/* Hindi Translation */}
      {analysis.hindiTranslation && (
        <SuggestionCard
          icon={Languages}
          title="Hindi Translation"
          content={analysis.hindiTranslation}
          onApply={onApplyTranslation}
          accentColor="orange"
          isLongContent={true}
        />
      )}

      {/* Tags Suggestion */}
      {analysis.tags && analysis.tags.length > 0 && (
        <div className="group rounded-xl border border-indigo-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-200">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600">
                <Tag size={16} />
              </div>
              <p className="font-semibold text-gray-900">Suggested Tags</p>
            </div>
            <button
              onClick={onApplyTags}
              className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 placeholder:opacity-50"
            >
              Apply All <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-md border border-indigo-100 bg-indigo-50/50 px-2.5 py-1 text-xs font-medium text-indigo-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Scores & Report */}
      {(analysis.seoScore ||
        analysis.readabilityScore ||
        analysis.suggestions) && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-gray-100 p-1.5 text-gray-700">
                <BarChart3 size={16} />
              </div>
              <h4 className="font-semibold text-gray-900">Analysis Report</h4>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Scores */}
              <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                {analysis.seoScore && (
                  <ScoreRow label="SEO Score" score={analysis.seoScore} />
                )}
                {analysis.readabilityScore && (
                  <ScoreRow label="Readability" score={analysis.readabilityScore} />
                )}
              </div>

              {/* Suggestions List */}
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div className="p-2">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Improvements
                  </p>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></span>
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

// Helper Components
const ScoreRow = ({ label, score }) => {
  let color = "text-red-600";
  if (score >= 70) color = "text-yellow-600";
  if (score >= 90) color = "text-green-600";

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full ${score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className={`text-sm font-bold ${color}`}>{score}</span>
      </div>
    </div>
  );
};

const SuggestionCard = ({
  icon: Icon,
  title,
  content,
  onApply,
  accentColor, // "blue", "green", "amber", etc.
  isLongContent = false,
}) => {
  // Map Tailwind colors dynamically (safelist safe usually, but being explicit is better if strict purging)
  // Simple mapping approach:
  const colors = {
    blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-500", btn: "bg-blue-600 hover:bg-blue-700" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-500", btn: "bg-emerald-600 hover:bg-emerald-700" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-500", btn: "bg-amber-600 hover:bg-amber-700" },
    orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-500", btn: "bg-orange-600 hover:bg-orange-700" },
  };

  const theme = colors[accentColor] || colors.blue;

  return (
    <div className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md`}>
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.bg.replace('bg-', 'bg-').replace('50', '500')}`}></div>

      <div className="p-4 pl-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`rounded-lg ${theme.bg} p-1.5 ${theme.text}`}>
              <Icon size={16} />
            </div>
            <h4 className="font-semibold text-gray-900">{title}</h4>
          </div>
          <button
            onClick={() => onApply(content)}
            className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 rounded-lg ${theme.bg} px-3 py-1.5 text-xs font-medium ${theme.text} hover:brightness-95`}
          >
            Apply <Check size={14} />
          </button>
        </div>

        <div className={`text-sm leading-relaxed text-gray-600 ${isLongContent ? "max-h-60 overflow-y-auto pr-2 custom-scrollbar" : ""}`}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default GeminiSuggestions;
