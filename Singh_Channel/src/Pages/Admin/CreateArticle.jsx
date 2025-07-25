import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Toggle, Input, RTE, Button, Spinner } from "../../Components";
import TagsInput from "../../Components/Ui/TagsInput";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import useGeminiAnalysis from "../../hooks/useGeminiAnalysis";
import GeminiSuggestions from "../../Components/Admin/GeminiSuggestions";
import { Bot, ChevronDown, Globe, Image, Sparkle, Tag } from "lucide-react";

export default function CreateArticle({ post }) {
  const [tags, setTags] = useState(post?.tags || []);
  const [loading, setLoading] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState(post?.language || "en");
  const [previewLanguage, setPreviewLanguage] = useState(
    post?.language || "en"
  );
  const [translating, setTranslating] = useState(false);

  // Initialize completion status based on existing content
  const [completionStatus, setCompletionStatus] = useState({
    en: !!(post?.headline?.en || post?.summary?.en || post?.content?.en),
    pu: !!(post?.headline?.pu || post?.summary?.pu || post?.content?.pu),
    hi: !!(post?.headline?.hi || post?.summary?.hi || post?.content?.hi),
  });

  const LANGUAGES = {
    en: { name: "English", code: "en" },
    pu: { name: "Punjabi", code: "pu" },
    hi: { name: "Hindi", code: "hi" },
  };

  const {
    register,
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
    isAvailable: isGeminiAvailable,
  } = useGeminiAnalysis();

  const cardClass =
    "rounded-xl bg-white p-6 shadow-sm border border-gray-100 w-full mb-6";
  const buttonClass =
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:shadow-md";

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
    setPreviewLanguage(sourceLanguage);
  }, [sourceLanguage]);

  // Handle Gemini errors
  useEffect(() => {
    if (geminiError) {
      toast.error(geminiError);
    }
  }, [geminiError]);

  // Watch for content changes to update completion status
  useEffect(() => {
    const subscription = watch((value) => {
      const newCompletionStatus = {};
      Object.keys(LANGUAGES).forEach((lang) => {
        newCompletionStatus[lang] = !!(
          value.headline?.[lang]?.trim() ||
          value.summary?.[lang]?.trim() ||
          value.content?.[lang]?.trim()
        );
      });
      setCompletionStatus(newCompletionStatus);
    });
    return () => subscription.unsubscribe();
  }, [watch, LANGUAGES]);

  const submit = async (data) => {
    setLoading(true);
    try {
      const form = new FormData();

      // Add multilingual content
      ["en", "pu", "hi"].forEach((lang) => {
        form.append(`headline_${lang}`, data.headline[lang] || "");
        form.append(`summary_${lang}`, data.summary[lang] || "");
        form.append(`content_${lang}`, data.content[lang] || "");
      });

      form.append("slug", data.slug);
      form.append("is_featured", data.is_featured);
      form.append("is_breaking", data.is_breaking);
      form.append("youtube_link", data.youtube_link || "");
      form.append("tags", JSON.stringify(tags));
      form.append("language", sourceLanguage);

      if (data.featured_image && data.featured_image[0]) {
        form.append("image", data.featured_image[0]);
      }

      let res;
      if (post) {
        res = await axios.put(`/api/v1/articles/${post._id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post("/api/v1/articles/newArticles", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.status === 200 || res.status === 201) {
        toast.success("Article saved successfully!");
        clearAnalysis();
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTranslations = async () => {
    if (previewLanguage !== sourceLanguage) {
      toast.error("Please switch to source language first");
      return;
    }

    const targetLanguages = Object.keys(LANGUAGES).filter(
      (lang) => lang !== sourceLanguage
    );

    setTranslating(true);

    try {
      const texts = {
        headline: getValues(`headline.${sourceLanguage}`),
        summary: getValues(`summary.${sourceLanguage}`),
        content: getValues(`content.${sourceLanguage}`),
      };

      if (!texts.content || texts.content.trim() === "") {
        toast.error("Please write some content first to translate");
        return;
      }

      console.log("Source texts:", texts);

      for (const lang of targetLanguages) {
        toast.info(`Translating to ${LANGUAGES[lang].name}...`);

        try {
          const translatedContent = await translateContent(texts, lang);
          console.log(`Translated content for ${lang}:`, translatedContent);

          if (translatedContent) {
            // Set translated content to form
            if (translatedContent.headline) {
              setValue(`headline.${lang}`, translatedContent.headline, {
                shouldValidate: true,
              });
            }
            if (translatedContent.summary) {
              setValue(`summary.${lang}`, translatedContent.summary, {
                shouldValidate: true,
              });
            }
            if (translatedContent.content) {
              setValue(`content.${lang}`, translatedContent.content, {
                shouldValidate: true,
              });
            }

            // Update completion status
            setCompletionStatus((prev) => ({
              ...prev,
              [lang]: true,
            }));

            toast.success(`Translation to ${LANGUAGES[lang].name} completed!`);
          } else {
            toast.error(`Failed to translate to ${LANGUAGES[lang].name}`);
          }
        } catch (langError) {
          console.error(`Translation error for ${lang}:`, langError);
          toast.error(`Failed to translate to ${LANGUAGES[lang].name}`);
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

  const handleSourceLanguageChange = (e) => {
    const newSourceLang = e.target.value;
    setSourceLanguage(newSourceLang);
    setPreviewLanguage(newSourceLang);
  };

  const handlePreviewLanguageChange = (lang) => {
    setPreviewLanguage(lang);
  };

  const handdleAnalyzeContent = async () => {
    const content = getValues(`content.${previewLanguage}`);
    if (!content || content.trim() === "") {
      toast.error("Please write some content first to analyze");
      return;
    }
    try {
      await analyzeContent(content, previewLanguage);
      toast.success("Content analysis completed!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze content");
    }
  };

  const handleGenerateHeadlines = async () => {
    const content = getValues(`content.${previewLanguage}`);
    if (!content || content.trim() === "") {
      toast.error("Please write some content first to generate headlines");
      return;
    }
    try {
      await generateHeadlines(content, previewLanguage);
      toast.success("Headlines generated!");
    } catch (error) {
      console.error("Headline generation error:", error);
      toast.error("Failed to generate headlines");
    }
  };

  const handleGenerateTags = async () => {
    const content = getValues(`content.${previewLanguage}`);
    if (!content || content.trim() === "") {
      toast.error("Please write some content first to generate tags");
      return;
    }
    try {
      const generatedTags = await generateTags(content, previewLanguage);
      if (generatedTags && generatedTags.length > 0) {
        setTags([...new Set([...tags, ...generatedTags])]);
        toast.success("Tags generated and added!");
      }
    } catch (error) {
      console.error("Tag generation error:", error);
      toast.error("Failed to generate tags");
    }
  };

  const onApplyHeadline = (headline) => {
    setValue(`headline.${previewLanguage}`, headline, { shouldValidate: true });
  };
  const onApplySummary = (summary) => {
    setValue(`summary.${previewLanguage}`, summary, { shouldValidate: true });
  };
  const onApplyContent = (content) => {
    setValue(`content.${previewLanguage}`, content, { shouldValidate: true });
  };
  const onApplyTranslation = (translation) => {
    setValue(`content.${previewLanguage}`, translation, {
      shouldValidate: true,
    });
  };

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit(submit)}
      className="flex min-h-screen flex-col gap-6 bg-gray-50 py-4 pl-4 md:flex-row"
    >
      <div className="flex-shrink-0 md:w-2/3">
        <div className={cardClass}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {post ? "Edit Article" : "Create New Article"}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {post ? "Editing" : "Draft"}
              </span>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Source Language
              </label>
              <div className="relative">
                <select
                  value={sourceLanguage}
                  onChange={handleSourceLanguageChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  {Object.entries(LANGUAGES).map(([code, lang]) => (
                    <option key={code} value={code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Preview Language
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(LANGUAGES).map(([code, lang]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handlePreviewLanguageChange(code)}
                    className={`relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      previewLanguage === code
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {lang.name}
                    <span
                      className={`ml-2 inline-block h-2 w-2 rounded-full ${
                        completionStatus[code] ? "bg-green-500" : "bg-red-500"
                      }`}
                      title={completionStatus[code] ? "Complete" : "Incomplete"}
                    ></span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleGenerateTranslations}
              disabled={translating}
              className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50`}
            >
              {translating ? (
                <>
                  <Spinner size="sm" /> Translating...
                </>
              ) : (
                <>
                  <Globe size={16} /> Translate all
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handdleAnalyzeContent}
              disabled={isAnalyzing}
              className={`${buttonClass} bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50`}
            >
              {isAnalyzing ? (
                <>
                  <Spinner size="sm" /> Analyzing...
                </>
              ) : (
                <>
                  <Bot size={16} /> Analyze
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleGenerateHeadlines}
              disabled={isAnalyzing}
              className={`${buttonClass} bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50`}
            >
              {isAnalyzing ? (
                <>
                  <Spinner size="sm" /> Generating...
                </>
              ) : (
                <>
                  <Sparkle size={16} /> Headline
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleGenerateTags}
              disabled={isAnalyzing}
              className={`${buttonClass} bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50`}
            >
              {isAnalyzing ? (
                <>
                  <Spinner size="sm" /> Generating...
                </>
              ) : (
                <>
                  <Tag size={16} /> Tags
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <Input
                key={`headline-${previewLanguage}`}
                label={`Headline (${LANGUAGES[previewLanguage]?.name})`}
                placeholder={`Article headline in ${LANGUAGES[previewLanguage]?.name}`}
                className="mb-1"
                {...register(`headline.${previewLanguage}`, {
                  required: "Headline is required",
                })}
                error={errors.headline?.[previewLanguage]}
              />
            </div>

            <div>
              <Input
                label="Slug"
                placeholder="article-headline-slug"
                className="mb-1"
                {...register("slug", { required: "Slug is required" })}
                onInput={(e) =>
                  setValue("slug", slugTransform(e.currentTarget.value), {
                    shouldValidate: true,
                  })
                }
                error={errors.slug}
              />
            </div>

            <div>
              <Input
                key={`summary-${previewLanguage}`}
                label={`Summary (${LANGUAGES[previewLanguage]?.name})`}
                placeholder={`Article summary in ${LANGUAGES[previewLanguage]?.name}`}
                className="mb-1"
                {...register(`summary.${previewLanguage}`, {
                  required: "Summary is required",
                })}
                error={errors.summary?.[previewLanguage]}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Content ({LANGUAGES[previewLanguage]?.name})
              </label>
              <RTE
                key={`rte-${previewLanguage}`}
                name={`content.${previewLanguage}`}
                control={control}
              />
            </div>
          </div>
        </div>

        <GeminiSuggestions
          analysis={analysis}
          onApplyHeadline={onApplyHeadline}
          onApplySummary={onApplySummary}
          onApplyContent={onApplyContent}
          onApplyTranslation={onApplyTranslation}
        />
      </div>

      <div className="flex w-full flex-col">
        <div className={cardClass}>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Featured Image
            </label>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Image size={24} strokeWidth={2} className="text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                <Input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  {...register("featured_image", {
                    required: !post && "Featured image is required",
                  })}
                  error={errors.featured_image}
                />
              </div>
            </div>
            {errors.featured_image && (
              <p className="mt-1 text-sm text-red-600">
                {errors.featured_image.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Featured Article
                </h4>
              </div>
              <Toggle {...register("is_featured")} />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Breaking News
                </h4>
              </div>
              <Toggle {...register("is_breaking")} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Tags</h3>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              {tags.length} / 10
            </span>
          </div>

          <TagsInput
            value={tags}
            onTagsChange={setTags}
            placeholder="Add article tags..."
            maxTags={10}
          />
          <div className="mt-4 flex flex-col gap-2">
            <h3 className="font-semibold text-gray-800">YouTube Link</h3>
            <Input
              placeholder="https://youtube.com/watch?v=..."
              className="mb-1"
              {...register("youtube_link")}
              error={errors.youtube_link}
            />
          </div>
        </div>

        <div className={cardClass}>
          <button
            type="submit"
            disabled={loading}
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
              <>{post ? "Update Article" : "Publish Article"}</>
            )}
          </button>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </form>
  );
}
