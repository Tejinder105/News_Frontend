import { X } from "lucide-react";
import React, { useState } from "react";

function TagsInput({ onTagsChange, placeholder = "Add tags...", maxTags = 5 }) {
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
      <div className="flex min-h-[48px] flex-wrap items-center gap-2 rounded-xl border-2 border-gray-200 bg-white p-3 transition-all duration-300 focus-within:border-blue-400 focus-within:shadow-md focus-within:shadow-blue-100 focus-within:outline-none hover:border-gray-300">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1.5 text-sm font-medium text-blue-800 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            {tag}
            <button
              type="button"
              className="ml-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 text-blue-600 transition-all duration-200 hover:bg-blue-200 hover:text-blue-800"
              onClick={() => removeTag(index)}
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 border-none bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={tags.length >= maxTags}
        />
      </div>
      {tags.length >= maxTags && (
        <small className="mt-2 block rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-600">
          ⚠️ Maximum {maxTags} tags allowed
        </small>
      )}
     
    </div>
  );
}

export default TagsInput;
