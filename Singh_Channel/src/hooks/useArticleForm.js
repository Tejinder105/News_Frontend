import { useRef, useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toSlug } from "/src/Utils/slug";
import { LANGUAGES } from "../Constants/Languages";

// Helper to handle legacy string data
const getInitialValue = (value) => {
    if (!value) return { en: "", pu: "", hi: "" };
    if (typeof value === "string") return { en: value, pu: "", hi: "" };
    return {
        en: value.en || "",
        pu: value.pu || "",
        hi: value.hi || "",
    };
};

export const useArticleForm = (post) => {
    const status = useRef("draft");
    const [completionStatus, setCompletionStatus] = useState({});
    const [tags, setTags] = useState(post?.tags || []);

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
            headline: getInitialValue(post?.headline),
            slug: post?.slug || "",
            content: getInitialValue(post?.content),
            summary: getInitialValue(post?.summary),
            isFeatured: post?.isFeatured || false,
            isBreaking: post?.isBreaking || false,
            youtubeLink: post?.youtubeLink || "",
            featuredImage: null
        },
    });

    const slugTransform = useCallback((value) => toSlug(value), []);

    // Sync tags from post prop
    useEffect(() => {
        if (post?.tags) {
            setTags(post.tags);
        }
    }, [post]);

    // Reset form when post changes
    useEffect(() => {
        if (post) {
            reset({
                headline: getInitialValue(post?.headline),
                slug: post?.slug || "",
                content: getInitialValue(post?.content),
                summary: getInitialValue(post?.summary),
                isFeatured: post?.isFeatured || false,
                isBreaking: post?.isBreaking || false,
                youtubeLink: post?.youtubeLink || "",
            });
            setTags(post.tags || []);
        }
    }, [post, reset]);

    // Watch for headline changes to update slug automatically
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            // Only auto-update slug if editing the English headline
            if (name === "headline.en" && value.headline?.en) {
                const newSlug = slugTransform(value.headline.en);
                setValue("slug", newSlug, { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    // Watch for content completion status
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
    }, [watch]);

    const handleTagsChange = (newTags) => {
        setTags(newTags);
    };

    const setStatus = (newStatus) => {
        status.current = newStatus;
    };

    return {
        register,
        control,
        handleSubmit,
        errors,
        watch,
        setValue,
        getValues,
        reset,
        tags,
        setTags, // In case we need manual override
        handleTagsChange,
        status, // Ref
        setStatus,
        completionStatus,
        slugTransform
    };
};
