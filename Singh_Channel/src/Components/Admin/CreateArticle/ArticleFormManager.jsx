import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

// Custom hook for article form management
export const useArticleForm = (post) => {
  const [tags, setTags] = useState(post?.tags || []);
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState(post?.language || "en");
  const [previewLanguage, setPreviewLanguage] = useState(post?.language || "en");
  const [translating, setTranslating] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Initialize completion status based on existing content
  const [completionStatus, setCompletionStatus] = useState({
    en: !!(post?.headline?.en || post?.summary?.en || post?.content?.en),
    pu: !!(post?.headline?.pu || post?.summary?.pu || post?.content?.pu),
    hi: !!(post?.headline?.hi || post?.summary?.hi || post?.content?.hi),
  });

  const LANGUAGES = {
    en: { name: "English", code: "en", flag: "🇺🇸" },
    pu: { name: "Punjabi", code: "pu", flag: "🇮🇳" },
    hi: { name: "Hindi", code: "hi", flag: "🇮🇳" },
  };

  // Form setup with react-hook-form
  const form = useForm({
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
    mode: 'onChange'
  });

  const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = form;

  // Helper function to safely get string value and trim it
  const safeStringValue = (value) => {
    return typeof value === 'string' ? value.trim() : '';
  };

  // Slug transformation utility
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

  // Language change handlers
  const handleSourceLanguageChange = useCallback((newLanguage) => {
    setSourceLanguage(newLanguage);
    setIsDirty(true);
  }, []);

  const handlePreviewLanguageChange = useCallback((newLanguage) => {
    setPreviewLanguage(newLanguage);
  }, []);

  // Update completion status when form values change
  const watchedValues = watch();
  useEffect(() => {
    const newCompletionStatus = {
      en: !!(watchedValues.headline?.en || watchedValues.summary?.en || watchedValues.content?.en),
      pu: !!(watchedValues.headline?.pu || watchedValues.summary?.pu || watchedValues.content?.pu),
      hi: !!(watchedValues.headline?.hi || watchedValues.summary?.hi || watchedValues.content?.hi),
    };
    setCompletionStatus(newCompletionStatus);
  }, [watchedValues]);

  // Auto-save functionality
  const handleAutoSave = useCallback(async () => {
    if (!isDirty) return;

    try {
      const formData = getValues();
      // Implement auto-save logic here
      console.log('Auto-saving...', formData);
      setIsDirty(false);
      toast.success('Draft saved automatically', { autoClose: 2000 });
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast.error('Auto-save failed');
    }
  }, [isDirty, getValues]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(handleAutoSave, 30000);
    return () => clearInterval(interval);
  }, [handleAutoSave]);

  // Form submission handler
  const onSubmit = useCallback(async (data) => {
    setLoading(true);
    try {
      // Validate required fields
      const currentLangData = {
        headline: data.headline[previewLanguage],
        content: data.content[previewLanguage],
        summary: data.summary[previewLanguage],
      };

      if (!currentLangData.headline?.trim()) {
        throw new Error(`Headline is required for ${LANGUAGES[previewLanguage].name}`);
      }

      if (!currentLangData.content?.trim()) {
        throw new Error(`Content is required for ${LANGUAGES[previewLanguage].name}`);
      }

      // Prepare submission data
      const submissionData = {
        ...data,
        tags,
        language: sourceLanguage,
        status: 'published'
      };

      console.log('Submitting article:', submissionData);
      
      // Here you would make the API call to save the article
      // await saveArticle(submissionData);
      
      toast.success(post ? 'Article updated successfully!' : 'Article published successfully!');
      setIsDirty(false);
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to save article');
    } finally {
      setLoading(false);
    }
  }, [tags, sourceLanguage, previewLanguage, post, LANGUAGES]);

  // Preview handler
  const handlePreview = useCallback(() => {
    const formData = getValues();
    console.log('Preview data:', formData);
    toast.info('Preview functionality coming soon!');
  }, [getValues]);

  // Mark form as dirty when values change
  useEffect(() => {
    const subscription = watch(() => {
      setIsDirty(true);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return {
    // Form state
    form,
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    errors,
    
    // Article state
    tags,
    setTags,
    loading,
    setLoading,
    isDirty,
    setIsDirty,
    sourceLanguage,
    setSourceLanguage,
    previewLanguage,
    setPreviewLanguage,
    translating,
    setTranslating,
    showSidebar,
    setShowSidebar,
    completionStatus,
    setCompletionStatus,
    
    // Utilities
    LANGUAGES,
    safeStringValue,
    slugTransform,
    
    // Handlers
    handleSourceLanguageChange,
    handlePreviewLanguageChange,
    onSubmit,
    handlePreview,
    handleAutoSave,
  };
};

// Error boundary component for form errors
export const FormErrorBoundary = ({ children, error }) => {
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Form Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message || 'An error occurred while processing the form.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

// Loading overlay component
export const LoadingOverlay = ({ loading, message = "Processing..." }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="text-gray-900 font-medium">{message}</span>
      </div>
    </div>
  );
};
