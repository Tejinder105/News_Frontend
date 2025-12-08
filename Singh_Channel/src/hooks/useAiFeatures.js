import { useState } from "react";
import { toast } from "react-toastify";
import useAiAnalysis from "./useGeminiAnalysis";
import { LANGUAGES } from "../Constants/Languages";

export const useAiFeatures = (sourceLanguage, previewLanguage, methods) => {
    const [translating, setTranslating] = useState(false);
    const { getValues, setValue } = methods;

    const {
        isAnalyzing,
        analysis,
        error: aiError,
        analyzeContent,
        generateHeadlines,
        generateTags,
        batchTranslate,
        clearAnalysis,
        isAuthenticated,
        isAuthLoading,
    } = useAiAnalysis();

    const handleGenerateTranslations = async () => {
        if (previewLanguage !== sourceLanguage) {
            toast.error("Please switch to source language first");
            return;
        }

        const targetLanguages = Object.keys(LANGUAGES).filter(
            (lang) => lang !== sourceLanguage
        );

        if (targetLanguages.length === 0) {
            toast.error("No target languages found for translation");
            return;
        }

        setTranslating(true);

        try {
            const sourceTexts = {
                headline: getValues(`headline.${sourceLanguage}`),
                summary: getValues(`summary.${sourceLanguage}`),
                content: getValues(`content.${sourceLanguage}`),
            };

            if (!sourceTexts.content || sourceTexts.content.trim() === "") {
                toast.error("Please write some content first to translate");
                return;
            }

            toast.info("Starting batch translation...");

            const batchResult = await batchTranslate(
                sourceTexts,
                sourceLanguage,
                targetLanguages
            );

            if (batchResult) {
                const { translations, errors, successCount, errorCount } = batchResult;

                // Apply successful translations
                Object.entries(translations).forEach(([lang, translatedResult]) => {
                    setValue(`headline.${lang}`, translatedResult.headline || "", {
                        shouldValidate: true,
                    });
                    setValue(`summary.${lang}`, translatedResult.summary || "", {
                        shouldValidate: true,
                    });
                    setValue(`content.${lang}`, translatedResult.content || "", {
                        shouldValidate: true,
                    });
                });

                if (successCount > 0) {
                    toast.success(`Successfully translated to ${successCount} language(s)!`);
                }

                if (errorCount > 0) {
                    console.warn("Translation errors:", errors);
                    toast.warning(`Failed to translate to ${errorCount} language(s). Check console.`);
                }

                if (successCount === 0) {
                    toast.error("All translations failed. Please try again.");
                }
            } else {
                toast.error("Batch translation failed. Please try again.");
            }
        } catch (error) {
            console.error("Translation error:", error);
            toast.error(`Translation failed: ${error.message}`);
        } finally {
            setTranslating(false);
        }
    };

    const handleAnalyzeContent = async () => {
        const content = getValues(`content.${previewLanguage}`);
        if (!content || content.trim() === "") {
            toast.error("Please write some content first to analyze");
            return;
        }
        await analyzeContent(content, previewLanguage);
        toast.success("Content analysis completed!");
    };

    const handleGenerateHeadlines = async () => {
        const content = getValues(`content.${previewLanguage}`);
        if (!content || content.trim() === "") {
            toast.error("Please write some content first to generate headlines");
            return;
        }
        await generateHeadlines(content, previewLanguage);
        toast.success("Headlines generated!");
    };

    const handleGenerateTags = async (currentTags, setTags) => {
        const content = getValues(`content.${previewLanguage}`);
        if (!content || content.trim() === "") {
            toast.error("Please write some content first to generate tags");
            return;
        }

        try {
            const result = await generateTags(content, 10);
            if (result && result.tags && Array.isArray(result.tags) && result.tags.length > 0) {
                const newTags = [...new Set([...currentTags, ...result.tags])];
                setTags(newTags);
                toast.success(`Generated ${result.tags.length} new tags!`);
            } else {
                toast.warning("No tags were generated.");
            }
        } catch (error) {
            console.error("Tag generation error:", error);
            toast.error(`Failed to generate tags: ${error.message}`);
        }
    };

    // Suggestion Application Handlers
    const onApplyHeadline = (headline) =>
        setValue(`headline.${previewLanguage}`, headline, { shouldValidate: true });

    const onApplySummary = (summary) =>
        setValue(`summary.${previewLanguage}`, summary, { shouldValidate: true });

    const onApplyContent = (content) =>
        setValue(`content.${previewLanguage}`, content, { shouldValidate: true });

    const onApplyTranslation = (translation) =>
        setValue(`content.${previewLanguage}`, translation, { shouldValidate: true });

    return {
        translating,
        isAnalyzing,
        analysis,
        aiError,
        isAuthenticated,
        isAuthLoading,
        handleGenerateTranslations,
        handleAnalyzeContent,
        handleGenerateHeadlines,
        handleGenerateTags,
        clearAnalysis,
        // Apply Handlers
        onApplyHeadline,
        onApplySummary,
        onApplyContent,
        onApplyTranslation
    };
};
