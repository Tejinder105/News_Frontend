import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";
import { LANGUAGES } from "../../Constants/Languages";
import {
  Button,
  ContentForm,
  TagsInput,
  Spinner,
  GeminiSuggestions,
  ImageUpload,
  AiTools,
  LanguageSwitcher,
  Panel,
  VideoSection,
  ArticleSettings
} from "../../Components";
import api from "/src/Services/apiClient";
import { Tags } from "lucide-react";

// Hooks
import { useArticleForm } from "/src/hooks/useArticleForm";
import { useAiFeatures } from "/src/hooks/useAiFeatures";

export default function CreateArticle({ post }) {
  const { getAccessTokenSilently, user } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [previewLanguage, setPreviewLanguage] = useState(post?.language || "en");

  // Initialize Form Hook (Handles exact form state and logic)
  const formMethods = useArticleForm(post);
  const {
    handleSubmit,
    setValue,
    control,
    watch,
    register,
    errors,
    tags, // from local state in hook
    setTags,
    handleTagsChange,
    status, // ref
    completionStatus,
    slugTransform,
    reset
  } = formMethods;

  // Initialize AI Hook (Handles all AI interactions)
  const aiFeatures = useAiFeatures(sourceLanguage, previewLanguage, formMethods);
  const {
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
    onApplyHeadline,
    onApplySummary,
    onApplyContent,
    onApplyTranslation
  } = aiFeatures;

  // Sync preview language
  useEffect(() => {
    setPreviewLanguage(sourceLanguage);
  }, [sourceLanguage]);

  // Handle AI errors
  useEffect(() => {
    if (aiError) {
      toast.error(aiError);
    }
  }, [aiError]);

  const submit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    // -- Data Prep --
    let headlineObj = data.headline;
    if (typeof headlineObj === "string") {
      try {
        headlineObj = JSON.parse(headlineObj);
      } catch (e) {
        toast.error("Invalid headline format");
        setLoading(false);
        return;
      }
    }

    if (data.featuredImage && data.featuredImage.length > 0) {
      const file = data.featuredImage[0];
      formData.append("featuredImage", file);
    } else if (!post) {
      toast.error("Please select a featured image");
      setLoading(false);
      return;
    }

    // -- Append Data --
    formData.append("headline", JSON.stringify(data.headline));
    formData.append("slug", data.slug);
    formData.append("content", JSON.stringify(data.content));
    formData.append("summary", JSON.stringify(data.summary));
    formData.append("isFeatured", data.isFeatured);
    formData.append("isBreaking", data.isBreaking);
    formData.append("youtubeLink", data.youtubeLink);
    formData.append("location", data.location || "");
    formData.append("tags", JSON.stringify(tags));
    formData.append("status", status.current);
    if (user) {
      formData.append("authorName", user.name);
      formData.append("authorImage", user.picture);
    }

    console.log("Submitting:", Object.fromEntries(formData));

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

      if (response.status === 200 || response.status === 201) {
        toast.success(`Article ${post ? "updated" : "created"} successfully!`);
        clearAnalysis();

        if (!post) {
          reset(); // Uses the hook's reset
          setTags([]);
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const wrapGenerateTags = () => handleGenerateTags(tags, setTags);

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
            handleSourceLanguageChange={(e) => setSourceLanguage(e.target.value)}
            previewLanguage={previewLanguage}
            handlePreviewLanguageChange={setPreviewLanguage}
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
            handleGenerateTags={wrapGenerateTags}
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
            onApplyTags={() => {
              if (analysis?.tags) {
                const newTags = [...new Set([...tags, ...analysis.tags])];
                setTags(newTags);
                toast.success("Tags applied!");
              }
            }}
            isAnalyzing={isAnalyzing}
          />
        </Panel>

        <div className="flex w-full flex-col sticky top-4 h-fit">
          <Panel variant="admin-form" className="mb-6">
            <ImageUpload
              register={register}
              error={errors.featuredImage}
              post={post}
              watch={watch}
            />

            {/* Tags Section */}
            <div className="group relative mb-2 overflow-hidden rounded-sm border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-300 hover:shadow-md">
              <div className="mb-3 flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-blue-50 text-blue-600">
                  <Tags className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold font-serif text-gray-800 sm:text-base">
                    Article Tags
                  </h4>
                </div>
              </div>
              <TagsInput
                onTagsChange={handleTagsChange}
                maxTags={5}
                initialTags={tags}
              />
            </div>

            <VideoSection register={register} errors={errors} watch={watch} />

            <ArticleSettings watch={watch} setValue={setValue} register={register} />
          </Panel>

          {/* Button Section */}
          <Panel variant="admin-form" className="mb-6 flex w-full gap-2">
            <Button
              type="submit"
              onClick={() => (status.current = "draft")}
              disabled={loading}
              className="flex w-full items-center justify-center rounded-sm bg-sky-400/50 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-gray-700"
            >
              {loading ? <Spinner size="sm" className="mr-1 sm:mr-2" /> : null}
              Save as Draft
            </Button>
            <button
              type="submit"
              disabled={loading}
              onClick={() => (status.current = "publish")}
              className={`flex w-full items-center justify-center rounded-sm px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 ${post
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
