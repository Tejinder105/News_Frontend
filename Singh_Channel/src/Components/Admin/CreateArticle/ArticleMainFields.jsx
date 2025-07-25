import React from "react";
import { Input, RTE } from "../..";

export default function ArticleMainFields({
  LANGUAGES,
  previewLanguage,
  register,
  setValue,
  slugTransform,
  errors,
  control,
}) {
  return (
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
  );
}
