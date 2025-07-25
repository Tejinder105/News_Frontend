import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Wand2, Bot, Globe, Sparkle, Tag } from 'lucide-react';
import useGeminiAnalysis from '../../../hooks/useGeminiAnalysis';
import GeminiSuggestions from '../GeminiSuggestions';

const ArticleAIIntegration = ({ 
  previewLanguage, 
  sourceLanguage, 
  setValue, 
  getValues, 
  tags, 
  setTags,
  translating,
  setTranslating,
  buttonClass 
}) => {
  const {
    isAnalyzing,
    analysis,
    error: geminiError,
    analyzeContent,
    generateHeadlines,
    translateContent,
    generateTags,
    clearAnalysis,
    isAvailable: isGeminiAvailable,
  } = useGeminiAnalysis();

  const [aiState, setAiState] = useState({
    isGeneratingHeadlines: false,
    isGeneratingTags: false,
    isTranslating: false,
  });

  const secondaryButtonClass = `${buttonClass} bg-gray-100 text-gray-700 hover:bg-gray-200`;

  // Enhanced content analysis
  const handleAnalyzeContent = async () => {
    const content = getValues(`content.${previewLanguage}`);
    if (!content || !content.trim()) {
      toast.error("Please add some content to analyze");
      return;
    }

    try {
      await analyzeContent(content, previewLanguage);
      toast.success("Content analyzed successfully!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze content");
    }
  };

  // Generate headlines with error handling
  const handleGenerateHeadlines = async () => {
    const content = getValues(`content.${previewLanguage}`);
    if (!content || !content.trim()) {
      toast.error("Please add content first to generate headlines");
      return;
    }

    setAiState(prev => ({ ...prev, isGeneratingHeadlines: true }));
    try {
      await generateHeadlines(content, previewLanguage);
      toast.success("Headlines generated successfully!");
    } catch (error) {
      console.error("Headline generation error:", error);
      toast.error("Failed to generate headlines");
    } finally {
      setAiState(prev => ({ ...prev, isGeneratingHeadlines: false }));
    }
  };

  // Generate translations with improved error handling
  const handleGenerateTranslations = async () => {
    const sourceContent = getValues(`content.${sourceLanguage}`);
    if (!sourceContent || !sourceContent.trim()) {
      toast.error("Please add content in the source language first");
      return;
    }

    if (sourceLanguage === previewLanguage) {
      toast.error("Source and target languages cannot be the same");
      return;
    }

    setTranslating(true);
    setAiState(prev => ({ ...prev, isTranslating: true }));
    
    try {
      const translation = await translateContent(
        sourceContent,
        sourceLanguage,
        previewLanguage
      );
      
      if (translation) {
        setValue(`content.${previewLanguage}`, translation, { shouldValidate: true });
        toast.success(`Content translated to ${previewLanguage.toUpperCase()}`);
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Translation failed. Please try again.");
    } finally {
      setTranslating(false);
      setAiState(prev => ({ ...prev, isTranslating: false }));
    }
  };

  // Generate tags with validation
  const handleGenerateTags = async () => {
    const content = getValues(`content.${previewLanguage}`);
    if (!content || !content.trim()) {
      toast.error("Please add content first to generate tags");
      return;
    }

    setAiState(prev => ({ ...prev, isGeneratingTags: true }));
    try {
      const generatedTags = await generateTags(content, previewLanguage);
      if (generatedTags && generatedTags.length > 0) {
        setTags([...new Set([...tags, ...generatedTags])]);
        toast.success(`Generated ${generatedTags.length} tags!`);
      } else {
        toast.info("No new tags were generated");
      }
    } catch (error) {
      console.error("Tag generation error:", error);
      toast.error("Failed to generate tags");
    } finally {
      setAiState(prev => ({ ...prev, isGeneratingTags: false }));
    }
  };

  // Apply AI suggestions handlers
  const onApplyHeadline = (headline) => {
    setValue(`headline.${previewLanguage}`, headline, { shouldValidate: true });
    toast.success("Headline applied!");
  };

  const onApplySummary = (summary) => {
    setValue(`summary.${previewLanguage}`, summary, { shouldValidate: true });
    toast.success("Summary applied!");
  };

  const onApplyContent = (content) => {
    setValue(`content.${previewLanguage}`, content, { shouldValidate: true });
    toast.success("Content applied!");
  };

  const onApplyTranslation = (translation) => {
    setValue(`content.${previewLanguage}`, translation, { shouldValidate: true });
    toast.success("Translation applied!");
  };

  const onApplyTags = (suggestedTags) => {
    if (suggestedTags && Array.isArray(suggestedTags)) {
      setTags(suggestedTags);
      toast.success(`Applied ${suggestedTags.length} tags!`);
    }
  };

  // Show error state if Gemini is not available
  if (!isGeminiAvailable) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <Bot className="w-5 h-5 text-yellow-600 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">AI Assistant Unavailable</h4>
            <p className="text-xs text-yellow-700 mt-1">
              AI features are currently unavailable. Please check your configuration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI Actions Header */}
      <div>
        <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
          <Wand2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
          <span>AI Assistant</span>
          {(isAnalyzing || aiState.isGeneratingHeadlines || aiState.isGeneratingTags || aiState.isTranslating) && (
            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin ml-2" />
          )}
        </h4>

        {/* AI Action Buttons */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleAnalyzeContent}
            disabled={isAnalyzing}
            className={`${secondaryButtonClass} text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </button>

          <button
            type="button"
            onClick={handleGenerateHeadlines}
            disabled={aiState.isGeneratingHeadlines}
            className={`${secondaryButtonClass} text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Sparkle className="w-3 h-3 sm:w-4 sm:h-4" />
            {aiState.isGeneratingHeadlines ? "Generating..." : "Headlines"}
          </button>

          <button
            type="button"
            onClick={handleGenerateTranslations}
            disabled={aiState.isTranslating}
            className={`${secondaryButtonClass} text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
            {aiState.isTranslating ? "Translating..." : "Translate"}
          </button>

          <button
            type="button"
            onClick={handleGenerateTags}
            disabled={aiState.isGeneratingTags}
            className={`${secondaryButtonClass} text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
            {aiState.isGeneratingTags ? "Generating..." : "Tags"}
          </button>

          {analysis && (
            <button
              type="button"
              onClick={clearAnalysis}
              className={`${secondaryButtonClass} text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 text-red-600 hover:bg-red-50`}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {geminiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-2">
              <p className="text-xs text-red-700">{geminiError}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      <GeminiSuggestions
        analysis={analysis}
        onApplyHeadline={onApplyHeadline}
        onApplySummary={onApplySummary}
        onApplyContent={onApplyContent}
        onApplyTranslation={onApplyTranslation}
        onApplyTags={onApplyTags}
      />
    </div>
  );
};

export default ArticleAIIntegration;
