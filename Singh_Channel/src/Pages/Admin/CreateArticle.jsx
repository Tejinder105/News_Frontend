import React, { useCallback, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { Spinner } from "/src/Components";
import useGeminiAnalysis from "/src/hooks/useGeminiAnalysis";
import GeminiSuggestions from "/src/Components/Admin/GeminiSuggestions";
import LanguageSwitcher from "/src/Components/Admin/CreateArticle/LanguageSwitcher";
import AiTools from "/src/Components/Admin/CreateArticle/AiTools";
import ImageUpload from "/src/Components/Admin/CreateArticle/ImageUpload";
import {
    Button,
    ContentForm,
    TagsInput,
    Toggle,
    Input,
} from "../../Components";
import axios from "axios";

export default function CreateArticle({ post }) {
    const [tags, setTags] = useState(post?.tags || []);
    const [loading, setLoading] = useState(false);
    const [srcLang, setsrcLang] = useState("en");
    const [previewLanguage, setPreviewLanguage] = useState(
        post?.language || "en"
    );
    const [translating, setTranslating] = useState(false);
    const [completionStatus, setCompletionStatus] = useState({});

    const status = useRef("draft");

    const LANGUAGES = {
        en: { name: "English", code: "en" },
        pu: { name: "Punjabi", code: "pu" },
        hi: { name: "Hindi", code: "hi" },
    };

    const {
        register,
        reset,
        handleSubmit,
        watch,
        setValue,
        control,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            headline: {
                en: post?.headline?.en || "",
                pu: post?.headline?.pu || "",
                hi: post?.headline?.hi || "",
            },
            slug: post?.slug || "",
            content: {
                en: post?.content?.en || "",
                pu: post?.content?.pu || "",
                hi: post?.content?.hi || "",
            },
            summary: {
                en: post?.summary?.en || "",
                pu: post?.summary?.pu || "",
                hi: post?.summary?.hi || "",
            },
            is_featured: post?.is_featured || false,
            is_breaking: post?.is_breaking || false,
            youtube_link: post?.youtube_link || "",
        },
    });

    const {
        isAnalyzing,
        analysis,
        error: geminiError,
        analyzeContent,
        generateHeadlines,
        translateContent,
        generateTags,
        clearAnalysis,
    } = useGeminiAnalysis();

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/--+/g, "-");
        }
        return "";
    }, []);

    // Watch for headline changes to update slug
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "headline.en") {
                const newSlug = slugTransform(value.headline.en);
                setValue("slug", newSlug, { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    // Update preview language when source language changes
    useEffect(() => {
        setPreviewLanguage(srcLang);
    }, [srcLang]);

    // Handle Gemini errors
    useEffect(() => {
        if (geminiError) {
            toast.error(geminiError);
        }
    }, [geminiError]);

    // Watch for content changes to update completion status
    useEffect(() => {
        const languageKeys = Object.keys(LANGUAGES);

        const subscription = watch((value) => {
            const newCompletionStatus = languageKeys.reduce((acc, lang) => {
                acc[lang] = Boolean(
                    value.headline?.[lang]?.trim() &&
                        value.summary?.[lang]?.trim() &&
                        value.content?.[lang]?.trim()
                );
                return acc;
            }, {});

            setCompletionStatus(newCompletionStatus);
        });

        return () => subscription.unsubscribe();
    }, [watch, LANGUAGES]);

    const submit = async (data) => {
        setLoading(true);
        const formData = new FormData();
        let headlineObj = data.headline;
    if (typeof headlineObj === 'string') {
      try {
        headlineObj = JSON.parse(headlineObj); // Convert string to object if it’s a JSON string
      } catch (e) {
        console.error("Invalid JSON in headline:", headlineObj);
        toast.error("Invalid headline format");
        setLoading(false);
        return;
      }
    }

        console.log("Raw form data:", data);

        console.log("Stringified data:", {
            headline: JSON.stringify(data.headline),
            content: JSON.stringify(data.content),
            summary: JSON.stringify(data.summary),
            tags: JSON.stringify(tags),
        });
       

        if (data.featured_image && data.featured_image.length > 0) {
            formData.append("featured_image", data.featured_image[0]);
        } else if (!post) {
            toast.error("Please select a featured image");
            setLoading(false);
            return;
        }

        // Append all form data
        formData.append("headline", JSON.stringify(data.headline));
        formData.append("slug", data.slug);
        formData.append("content", JSON.stringify(data.content)); // Fixed: stringify content
        formData.append("summary", JSON.stringify(data.summary));
        formData.append("is_featured", data.is_featured);
        formData.append("is_breaking", data.is_breaking);
        formData.append("youtube_link", data.youtube_link);
        formData.append("tags", JSON.stringify(tags));
        formData.append("status", status.current);

        console.log("Form data being submitted:", {
            headline: data.headline,
            slug: data.slug,
            content: data.content,
            summary: data.summary,
            is_featured: data.is_featured,
            is_breaking: data.is_breaking,
            youtube_link: data.youtube_link,
            tags,
            status: status.current,
            featured_image: data.featured_image,
        });

        try {
            const url = post
                ? `${import.meta.env.VITE_API_URL}/api/v1/articles/newArticles${post._id}`
                : `${import.meta.env.VITE_API_URL}/api/v1/articles/newArticles`;

            const method = post ? "put" : "post";

            const response = await axios[method](url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Check for successful response
            if (response.status === 200 || response.status === 201) {
                toast.success(
                    `Article ${post ? "updated" : "created"} successfully!`
                );
                clearAnalysis();

                // Reset form for new articles only
                if (!post) {
                    reset({
                        headline: { en: "", pu: "", hi: "" },
                        slug: "",
                        content: { en: "", pu: "", hi: "" },
                        summary: { en: "", pu: "", hi: "" },
                        is_featured: false,
                        is_breaking: false,
                        youtube_link: "",
                        featured_image: null,
                    });
                    setTags([]);
                }
            } else {
                toast.error("Unexpected response from server");
            }
        } catch (error) {
            console.error("Submit error:", error);
            // Log detailed error information
            if (error.response) {
                console.error("Error response data:", error.response);
            } else if (error.request) {
                console.error("Error request:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
            toast.error(
                error.response?.data?.message || "Something went wrong!"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateTranslations = async () => {
        if (previewLanguage !== srcLang) {
            toast.error("Please switch to source language first");
            return;
        }

        const targetLanguages = Object.keys(LANGUAGES).filter(
            (lang) => lang !== srcLang
        );

        setTranslating(true);

        try {
            const sourceTexts = {
                headline: getValues(`headline.${srcLang}`),
                summary: getValues(`summary.${srcLang}`),
                content: getValues(`content.${srcLang}`),
            };

            if (!sourceTexts.content || sourceTexts.content.trim() === "") {
                toast.error("Please write some content first to translate");
                return;
            }

            for (const lang of targetLanguages) {
                toast.info(`Translating to ${LANGUAGES[lang].name}...`);

                // Single API call for the current target language
                const translatedResult = await translateContent(
                    sourceTexts,
                    srcLang,
                    lang
                );

                if (translatedResult) {
                    // Explicitly set each field. This is clear and safe.
                    setValue(
                        `headline.${lang}`,
                        translatedResult.headline || "",
                        {
                            shouldValidate: true,
                        }
                    );
                    setValue(
                        `summary.${lang}`,
                        translatedResult.summary || "",
                        {
                            shouldValidate: true,
                        }
                    );
                    setValue(
                        `content.${lang}`,
                        translatedResult.content || "",
                        {
                            shouldValidate: true,
                        }
                    );

                    toast.success(
                        `Translation to ${LANGUAGES[lang].name} completed!`
                    );
                } else {
                    toast.error(
                        `Failed to translate to ${LANGUAGES[lang].name}`
                    );
                }
            }
            toast.success("All translations completed!");
        } catch (error) {
            console.error("Translation error:", error);
            toast.error("Failed to generate translations");
        } finally {
            setTranslating(false);
        }
    };

    const handlesrcLangChange = (e) => {
        const newSourceLang = e.target.value;
        setsrcLang(newSourceLang);
        setPreviewLanguage(newSourceLang);
    };

    const handlePreviewLanguageChange = (lang) => {
        setPreviewLanguage(lang);
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
            toast.error(
                "Please write some content first to generate headlines"
            );
            return;
        }
        await generateHeadlines(content, previewLanguage);
        toast.success("Headlines generated!");
    };

    const handleGenerateTags = async () => {
        const content = getValues(`content.${previewLanguage}`);
        if (!content || content.trim() === "") {
            toast.error("Please write some content first to generate tags");
            return;
        }
        const generatedTags = await generateTags(content, previewLanguage);
        if (generatedTags && generatedTags.length > 0) {
            setTags([...new Set([...tags, ...generatedTags])]);
            toast.success("Tags generated and added!");
        }
    };

    const handleTagsChange = (newTags) => {
        setTags(newTags);
        console.log("Updated Tags:", tags);
    };

    const onApplyHeadline = (headline) =>
        setValue(`headline.${previewLanguage}`, headline, {
            shouldValidate: true,
        });
    const onApplySummary = (summary) =>
        setValue(`summary.${previewLanguage}`, summary, {
            shouldValidate: true,
        });
    const onApplyContent = (content) =>
        setValue(`content.${previewLanguage}`, content, {
            shouldValidate: true,
        });
    const onApplyTranslation = (translation) =>
        setValue(`content.${previewLanguage}`, translation, {
            shouldValidate: true,
        });

    return (
        <>
            <form
                encType="multipart/form-data"
                onSubmit={handleSubmit(submit)}
                className="flex min-h-screen flex-col gap-6 bg-gray-50 py-4 pl-4 md:flex-row"
            >
                <div className="flex-shrink-0 rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:w-2/3">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {post ? "Edit Article" : "Create New Article"}
                        </h2>
                    </div>

                    <LanguageSwitcher
                        LANGUAGES={LANGUAGES}
                        srcLang={srcLang}
                        handlesrcLangChange={handlesrcLangChange}
                        previewLanguage={previewLanguage}
                        handlePreviewLanguageChange={
                            handlePreviewLanguageChange
                        }
                        completionStatus={completionStatus}
                    />

                    <AiTools
                        translating={translating}
                        isAnalyzing={isAnalyzing}
                        handleGenerateTranslations={handleGenerateTranslations}
                        handleAnalyzeContent={handleAnalyzeContent}
                        handleGenerateHeadlines={handleGenerateHeadlines}
                        handleGenerateTags={handleGenerateTags}
                    />

                    <ContentForm
                        previewLanguage={previewLanguage}
                        LANGUAGES={LANGUAGES}
                        register={register}
                        errors={errors}
                        control={control}
                        setValue={setValue}
                        slugTransform={slugTransform}
                    />

                    <GeminiSuggestions
                        analysis={analysis}
                        onApplyHeadline={onApplyHeadline}
                        onApplySummary={onApplySummary}
                        onApplyContent={onApplyContent}
                        onApplyTranslation={onApplyTranslation}
                    />
                </div>
                <div className="flex w-full flex-col">
                    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <ImageUpload
                            register={register}
                            errors={errors}
                            isEditMode={!!post}
                            post={post}
                        />
                        <div>
                            <label>Tags</label>
                        </div>
                        <TagsInput
                            onTagsChange={handleTagsChange}
                            maxTags={5}
                        />
                        <div className="mt-3 flex flex-col gap-2 sm:mt-4">
                            <h3 className="text-sm font-semibold text-gray-800 sm:text-base">
                                YouTube Link
                            </h3>
                            <Input
                                placeholder="https://youtube.com/watch?v=..."
                                className="mb-1 text-sm"
                                {...register("youtube_link")}
                                error={errors.youtube_link}
                            />
                        </div>

                        <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
                            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5 sm:p-3">
                                <h4 claasname="text-xs font-medium text-gray-700">
                                    Featured Article
                                </h4>
                                <Toggle {...register("is_featured")} />
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5 sm:p-3">
                                <div>
                                    <h4 className="text-xs font-medium text-gray-700 sm:text-sm">
                                        Breaking News
                                    </h4>
                                </div>
                                <Toggle {...register("is_breaking")} />
                            </div>
                        </div>
                    </div>

                    {/* Tags Section */}

                    <div className="mb-6 flex w-full gap-2 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <Button
                            type="submit"
                            onClick={() => (status.current = "draft")}
                            disabled={loading}
                            className="flex w-full items-center justify-center rounded-lg bg-sky-400/50 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-gray-700"
                        >
                            {loading ? (
                                <Spinner size="sm" className="mr-1 sm:mr-2" />
                            ) : null}
                            Save as Draft
                        </Button>
                        <button
                            type="submit"
                            disabled={loading}
                            onClick={() => (status.current = "publish")}
                            className={`flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 ${
                                post
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                            } disabled:opacity-50`}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" className="mr-2" />
                                    {post ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                <>
                                    {post
                                        ? "Update Article"
                                        : "Publish Article"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
            <ToastContainer position="bottom-right" autoClose={3000} />
        </>
    );
}
