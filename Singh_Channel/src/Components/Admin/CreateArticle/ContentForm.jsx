import React from "react";
import { LANGUAGES } from "../../../Constants/Languages";
import RTE from "../RTE";
import Input from "../../Ui/Input";

function ContentForm({
  register,
  control,
  setValue,
  errors,
  previewLanguage,
  languages = LANGUAGES,
  slugTransform,
}) {
  return (
    <div className="space-y-6">
      {/* Headline Section */}
      <div>
        <Input
          key={`headline-${previewLanguage}`}
          label={`Headline (${languages[previewLanguage]?.name})`}
          type="text"
          placeholder={`Article headline in ${languages[previewLanguage]?.name}`}
          className="text-sm focus:border-blue-500"
          {...register(`headline.${previewLanguage}`, {
            required: "Headline is required",
          })}
        />
        {errors.headline?.[previewLanguage] && (
          <p className="mt-2 text-sm text-red-600">
            {errors.headline[previewLanguage]?.message}
          </p>
        )}
      </div>

      {/* Slug Section */}
      <div>
        <Input
          label="Slug"
          type="text"
          placeholder="article-headline-slug"
          className="text-sm focus:border-blue-500"
          {...register("slug", { required: "Slug is required" })}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            })
          }
        />
        {errors.slug && (
          <p className="mt-2 text-sm text-red-600">{errors.slug?.message}</p>
        )}
      </div>

      {/* Summary Section */}
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">
          Summary ({languages[previewLanguage]?.name})
        </label>
        <textarea
          key={`summary-${previewLanguage}`}
          rows={3}
          placeholder={`Brief summary of the article in ${languages[previewLanguage]?.name}`}
          className="w-full resize-none rounded-sm border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          {...register(`summary.${previewLanguage}`, {
            required: "Summary is required",
          })}
        />
        {errors.summary?.[previewLanguage] && (
          <p className="mt-2 text-sm text-red-600">
            {errors.summary[previewLanguage]?.message}
          </p>
        )}
      </div>

      {/* Content Section */}
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">
          Content ({languages[previewLanguage]?.name})
        </label>

        <RTE
          key={`rte-${previewLanguage}`}
          name={`content.${previewLanguage}`}
          control={control}
        />

        {errors.content?.[previewLanguage] && (
          <p className="mt-2 text-sm text-red-600">
            {errors.content[previewLanguage]?.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ContentForm;
