import React, { useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Input from "../../Components/Ui/Input";
import RTE from "../../Components/Admin/RTE";
import Button from "../../Components/Ui/Button";
import Toggle from "../../Components/Ui/Toggle";

export default function CreateArticle({ post }) {
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
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
    },
  });

  const cardClass = "rounded-lg bg-white p-4 shadow w-full mb-4 sm:mb-0";

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

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        const newSlug = slugTransform(value.title);
        setValue("slug", newSlug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  const submit = async (data) => {
    if (post) {
      console.log("data:", data);
    } else {
      console.log("Create new article:", data);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex min-h-screen flex-col gap-1 bg-slate-100 py-4 md:flex-row"
    >
      <div className="w-full flex-shrink-0 px-2 md:w-2/3">
        <div className={cardClass}>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            {post ? "Edit Article" : "Create New Article"}
          </h2>
          <Input
            label="Title:"
            placeholder="Article Title"
            className="mb-4"
            {...register("title", { required: "Title is required" })}
            error={errors.title}
          />

          <Input
            label="Slug:"
            placeholder="article-title-slug"
            className="mb-4"
            {...register("slug", { required: "Slug is required" })}
            onInput={(e) =>
              setValue("slug", slugTransform(e.currentTarget.value), {
                shouldValidate: true,
              })
            }
            error={errors.slug}
          />

          <RTE
            label="Content :"
            name="content"
            control={control}
            defaultValue={getValues("content")}
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 px-2 md:w-1/3">
        <div className={cardClass + " flex flex-col items-center"}>
          <h3 className="mb-4 text-lg font-semibold text-gray-700">Actions</h3>
          <Button
            type="submit"
            bgColor={post ? "bg-green-500" : undefined}
            className="w-full py-2 text-lg font-semibold"
          >
            {post ? "Update" : "Submit"}
          </Button>
        </div>

        <div className={cardClass + " flex flex-col items-center"}>
          <Input
            label="Image"
            type="file"
            className="mb-4 file:rounded-full file:border-0 file:bg-blue-500 file:px-4 file:py-1 file:text-sm file:font-semibold file:text-white hover:bg-blue-50"
            {...register("featured_image", {
              required: "Featured image is required",
              validate: (value) => {
                if (value && value.length > 0) return true;
                return "Featured image is required";
              },
            })}
            error={errors.featured_image}
          />
        </div>

        <div className={cardClass + " flex flex-col items-center"}>
          <div className="mt-2 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <Controller
              name="is_featured"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Toggle
                  id="featured-toggle"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  label="Featured"
                />
              )}
            />
            <Controller
              name="is_breaking"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Toggle
                  id="breaking-toggle"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  label="Breaking"
                />
              )}
            />
          </div>
        </div>

        <div className={cardClass + " flex flex-col items-center"}>
          <Input
            label="Youtube Link"
            type="url"
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            {...register("youtube_link", {
              required: "Youtube link is required",
              pattern: {
                value: /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+$/,
                message: "Invalid YouTube link",
              },
            })}
            error={errors.youtube_link}
          />
        </div>
      </div>
    </form>
  );
}
