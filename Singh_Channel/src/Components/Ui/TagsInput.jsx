import { X } from "lucide-react";
import React, { useState } from "react";

function TagsInput({
  onTagsChange,
  placeholder = "Add tags...",
  maxTags = 5,
}) {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue) && tags.length < maxTags) {
      const newTags = [...tags, trimmedValue];
      setTags(newTags);
      setInputValue("");
      onTagsChange && onTagsChange(newTags);
    }
  };

  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onTagsChange && onTagsChange(newTags);
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag();
    }
  };

  return (
    <div className="w-full">
      <div className="flex min-h-[44px] flex-wrap items-center gap-2 rounded-lg border border-gray-300 bg-white p-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:outline-none">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm font-medium text-gray-700"
          >
            {tag}
            <button
              type="button"
              className="ml-1 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 text-base leading-none text-gray-500 transition-colors hover:bg-gray-300 hover:text-gray-700"
              onClick={() => removeTag(index)}
              aria-label={`Remove ${tag}`}
            ><X/></button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 border-none bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={tags.length >= maxTags}
        />
      </div>
      {tags.length >= maxTags && (
        <small className="mt-1 block text-xs text-red-500">
          Maximum {maxTags} tags allowed
        </small>
      )}
    </div>
  );
}

export default TagsInput;
