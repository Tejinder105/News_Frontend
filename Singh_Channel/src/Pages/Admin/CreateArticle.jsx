import React, { useCallback, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import useAiAnalysis from "/src/hooks/useGeminiAnalysis";
import { useAuth0 } from "@auth0/auth0-react";
import { LANGUAGES } from "../../Constants/Languages";
import {
  Button,
  ContentForm,
  TagsInput,
  Toggle,
  Input,
  Spinner,
  GeminiSuggestions,
  ImageUpload,
  AiTools,
  LanguageSwitcher,
  Panel,
} from "../../Components";
import api from "/src/Services/apiClient";
import { Tags, Video } from "lucide-react";
import { toSlug } from "/src/utils/slug";

export default function CreateArticle({ post }) {
  const { getAccessTokenSilently } = useAuth0();
  const [tags, setTags] = useState(post?.tags || []);
  const [loading, setLoading] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [previewLanguage, setPreviewLanguage] = useState(
    post?.language || "en"
  );
  const [translating, setTranslating] = useState(false);
  const [completionStatus, setCompletionStatus] = useState({});

  const status = useRef("draft");

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
      isFeatured: post?.isFeatured || false,
      isBreaking: post?.isBreaking || false,
      youtubeLink: post?.youtubeLink || "",
    },
  });

  const {
    isAnalyzing,
    analysis,
    error: aiError,
    analyzeContent,
    generateHeadlines,
    translateContent,
    generateTags,
    batchTranslate,
    clearAnalysis,
    isAuthenticated,
    isAuthLoading,
  } = useAiAnalysis();

  const slugTransform = useCallback((value) => toSlug(value), []);

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

  // Handle AI errors
  useEffect(() => {
    if (aiError) {
      toast.error(aiError);
    }
  }, [aiError]);

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

  useEffect(() => {
    if (post?.tags) {
      setTags(post.tags);
    }
  }, [post]);

  useEffect(() => {
    if (post) {
      reset({
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
        isFeatured: post?.isFeatured || false,
        isBreaking: post?.isBreaking || false,
        youtubeLink: post?.youtubeLink || "",
      });
    }
  }, [post, reset]);

  const submit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    let headlineObj = data.headline;
    if (typeof headlineObj === "string") {
      try {
        headlineObj = JSON.parse(headlineObj);
      } catch (e) {
        console.error("Invalid JSON in headline:", headlineObj);
        toast.error("Invalid headline format");
        setLoading(false);
        return;
      }
    }

    if (data.featuredImage && data.featuredImage.length > 0) {
      const file = data.featuredImage[0];
      if (post) {
        formData.append("featured_image", file);
      } else {
        formData.append("featuredImage", file);
      }
    } else if (!post) {
      toast.error("Please select a featured image");
      setLoading(false);
      return;
    }

    // Append all form data
    formData.append("headline", JSON.stringify(data.headline));
    formData.append("slug", data.slug);
    formData.append("content", JSON.stringify(data.content));
    formData.append("summary", JSON.stringify(data.summary));
    formData.append("isFeatured", data.isFeatured);
    formData.append("isBreaking", data.isBreaking);
    // Field name differs on update API (youtube_link) vs create (youtubeLink)
    if (post) {
      formData.append("youtube_link", data.youtubeLink);
    } else {
      formData.append("youtubeLink", data.youtubeLink);
    }
    formData.append("tags", JSON.stringify(tags));
    formData.append("status", status.current);

    console.log("Form data being submitted:", {
      headline: data.headline,
      slug: data.slug,
      content: data.content,
      summary: data.summary,
      isFeatured: data.isFeatured,
      isBreaking: data.isBreaking,
      youtubeLink: data.youtubeLink,
      tags,
      status: status.current,
      featuredImage: data.featuredImage,
    });

    try {
      const url = post
        ? `/api/v1/admin/articles/${post._id}`
        : `/api/v1/articles/newArticles`;

      const method = post ? "put" : "post";
      const token = await getAccessTokenSilently();
      const response = await api[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Check for successful response
      if (response.status === 200 || response.status === 201) {
        toast.success(`Article ${post ? "updated" : "created"} successfully!`);
        clearAnalysis();

        // Reset form for new articles only
        if (!post) {
          reset({
            headline: { en: "", pu: "", hi: "" },
            slug: "",
            content: { en: "", pu: "", hi: "" },
            summary: { en: "", pu: "", hi: "" },
            isFeatured: false,
            isBreaking: false,
            youtubeLink: "",
            featuredImage: null,
          });
          setTags([]); 
        }
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Submit error:", error);
      if (error.response) {
        console.error("Error response data:", error.response);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
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

      // Use the new batch translate feature for better performance
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

        // Show results
        if (successCount > 0) {
          toast.success(`Successfully translated to ${successCount} language(s)!`);
        }

        if (errorCount > 0) {
          console.warn("Translation errors:", errors);
          toast.warning(`Failed to translate to ${errorCount} language(s). Check console for details.`);
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

  const handleSourceLanguageChange = (e) => {
    const newSourceLang = e.target.value;
    setSourceLanguage(newSourceLang);
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
      toast.error("Please write some content first to generate headlines");
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
    
    try {
      const result = await generateTags(content, 10);
      if (result && result.tags && Array.isArray(result.tags) && result.tags.length > 0) {
        // Merge with existing tags and remove duplicates
        const newTags = [...new Set([...tags, ...result.tags])];
        setTags(newTags);
        toast.success(`Generated ${result.tags.length} new tags!`);
      } else {
        toast.warning("No tags were generated. Please try with different content.");
      }
    } catch (error) {
      console.error("Tag generation error:", error);
      toast.error(`Failed to generate tags: ${error.message}`);
    }
  };

  const handleTagsChange = (newTags) => {
    setTags(newTags);
    console.log("Updated Tags:", newTags); // Log the new tags instead of old state
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
        <Panel variant="admin-form" className="flex-shrink-0 md:w-2/3">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {post ? "Edit Article" : "Create New Article"}
            </h2>
          </div>

          <LanguageSwitcher
            LANGUAGES={LANGUAGES}
            sourceLanguage={sourceLanguage}
            handleSourceLanguageChange={handleSourceLanguageChange}
            previewLanguage={previewLanguage}
            handlePreviewLanguageChange={handlePreviewLanguageChange}
            completionStatus={completionStatus}
          />

          <AiTools
            translating={translating}
            isAnalyzing={isAnalyzing}
            isAuthenticated={isAuthenticated}
            isAuthLoading={isAuthLoading}
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
        </Panel>
        <div className="flex w-full flex-col">
          <Panel variant="admin-form" className="mb-6">
            <ImageUpload
              register={register}
              errors={errors}
              post={post}
            />

            {/* Tags Section */}
            <div className="group relative mb-2 overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 transition-all duration-300 hover:border-blue-300 hover:shadow-md">
              <div className="mb-3 flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Tags />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 sm:text-base">
                    Article Tags
                  </h4>
                </div>
              </div>
              <TagsInput
                onTagsChange={handleTagsChange}
                maxTags={5}
                initialTags={tags}
              />
              <div className="absolute -top-8 -right-8 h-16 w-16 rounded-full bg-blue-200 opacity-20 transition-all duration-300 group-hover:scale-110"></div>
            </div>

            {/* YouTube Link Section */}
            <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50 p-4 transition-all duration-300 hover:border-gray-300 hover:shadow-md">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                  <Video />
                </div>

                <h4 className="text-sm font-semibold text-gray-800 sm:text-base">
                  YouTube Video
                </h4>
              </div>
              <Input
                placeholder="https://youtube.com/watch?v=..."
                className="mb-1 text-sm"
                {...register("youtubeLink")}
                error={errors.youtubeLink}
              />
              <div className="absolute -top-8 -right-8 h-16 w-16 rounded-full bg-gray-200 opacity-20 transition-all duration-300 group-hover:scale-110"></div>
            </div>

            <div className="mt-4 space-y-4 sm:mt-6">
              {/* Featured Article */}
              <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 transition-all duration-300 hover:border-blue-300 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 sm:text-base">
                        Featured Article
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Toggle
                      checked={watch("isFeatured")}
                      onChange={(e) =>
                        setValue("isFeatured", e.target.checked)
                      }
                      variant="featured"
                    />
                  </div>
                </div>
                <div className="absolute -top-8 -right-8 h-16 w-16 rounded-full bg-blue-200 opacity-20 transition-all duration-300 group-hover:scale-110"></div>
              </div>

              {/* Breaking News */}
              <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-r from-blue-100 to-indigo-100 p-2 transition-all duration-300 hover:border-blue-400 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 sm:text-base">
                        Breaking News
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Toggle
                      checked={watch("isBreaking")}
                      onChange={(e) =>
                        setValue("isBreaking", e.target.checked)
                      }
                      variant="breaking"
                    />
                  </div>
                </div>
                <div className="absolute -top-8 -right-8 h-16 w-16 rounded-full bg-blue-300 opacity-20 transition-all duration-300 group-hover:scale-110"></div>
              </div>
            </div>
          </Panel>

          {/* Button Section */}

          <Panel variant="admin-form" className="mb-6 flex w-full gap-2">
            <Button
              type="submit"
              onClick={() => (status.current = "draft")}
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-sky-400/50 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-gray-700"
            >
              {loading ? <Spinner size="sm" className="mr-1 sm:mr-2" /> : null}
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
                <>{post ? "Update Article" : "Publish Article"}</>
              )}
            </button>
          </Panel>
        </div>
      </form>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
