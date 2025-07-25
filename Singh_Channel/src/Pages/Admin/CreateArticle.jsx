import React from "react";
import { ToastContainer } from "react-toastify";
import { LanguageSelectors,ArticleAIIntegration,ArticleHeader,ArticleSidebar,ArticleMainFields } from "../../Components";
import { 
  useArticleForm, 
  FormErrorBoundary, 
  LoadingOverlay 
} from "../../Components";

export default function CreateArticle({ post }) {
  // Use the custom hook for form management
  const {
    // Form state
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    errors,
    
    // Article state
    tags,
    setTags,
    loading,
    isDirty,
    sourceLanguage,
    previewLanguage,
    translating,
    setTranslating,
    showSidebar,
    setShowSidebar,
    completionStatus,
    
    // Utilities
    LANGUAGES,
    slugTransform,
    
    // Handlers
    handleSourceLanguageChange,
    handlePreviewLanguageChange,
    onSubmit,
    handlePreview,
  } = useArticleForm(post);

  // Enhanced styling classes
  const cardClass = "rounded-xl bg-white p-6 shadow-sm border border-gray-200 w-full mb-6 hover:shadow-md transition-shadow duration-200";
  const buttonClass = "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

  return (
    <FormErrorBoundary error={null}>
      <div className="min-h-screen bg-gray-50">
        {/* Loading Overlay */}
        <LoadingOverlay 
          loading={loading} 
          message={post ? "Updating article..." : "Publishing article..."} 
        />

        {/* Header */}
        <ArticleHeader
          post={post}
          isDirty={isDirty}
          loading={loading}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          onSave={handleSubmit(onSubmit)}
          onPreview={handlePreview}
          buttonClass={buttonClass}
        />

        {/* Main Content */}
        <form
          id="article-form"
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8"
          aria-label={post ? "Edit Article Form" : "Create Article Form"}
        >
          <div className="flex w-full flex-col gap-4 sm:gap-6 overflow-x-hidden lg:flex-row lg:items-start">
            {/* Main Content Area */}
            <div className="min-w-0 flex-1">
              <div className={`${cardClass} p-4 sm:p-6`}>
                {/* Article Configuration Section */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Article Configuration
                  </h3>
                  
                  {/* Language Selection */}
                  <LanguageSelectors
                    sourceLanguage={sourceLanguage}
                    handleSourceLanguageChange={handleSourceLanguageChange}
                    LANGUAGES={LANGUAGES}
                    previewLanguage={previewLanguage}
                    handlePreviewLanguageChange={handlePreviewLanguageChange}
                    completionStatus={completionStatus}
                  />
                  
                  {/* AI Integration */}
                  <div className="mt-4 sm:mt-6">
                    <ArticleAIIntegration
                      previewLanguage={previewLanguage}
                      sourceLanguage={sourceLanguage}
                      setValue={setValue}
                      getValues={getValues}
                      tags={tags}
                      setTags={setTags}
                      translating={translating}
                      setTranslating={setTranslating}
                      buttonClass={buttonClass}
                    />
                  </div>
                </div>

                {/* Main Article Fields */}
                <ArticleMainFields
                  LANGUAGES={LANGUAGES}
                  previewLanguage={previewLanguage}
                  register={register}
                  setValue={setValue}
                  slugTransform={slugTransform}
                  errors={errors}
                  control={control}
                />
              </div>

              {/* Mobile Sidebar */}
              <div className="block lg:hidden">
                <ArticleSidebar
                  post={post}
                  register={register}
                  errors={errors}
                  tags={tags}
                  setTags={setTags}
                  loading={loading}
                />
              </div>
            </div>

            {/* Desktop Sidebar */}
            <aside
              className="hidden lg:block lg:w-1/3 lg:max-w-sm lg:min-w-[320px] lg:pl-6"
              aria-label="Article Sidebar"
              role="complementary"
            >
              <div className="sticky top-6">
                <ArticleSidebar
                  post={post}
                  register={register}
                  errors={errors}
                  tags={tags}
                  setTags={setTags}
                  loading={loading}
                />
              </div>
            </aside>
          </div>
        </form>

        {/* Toast Container */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </FormErrorBoundary>
  );
}

