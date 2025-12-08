import { X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

function TagsInput({ onTagsChange, placeholder = "Add tags...", maxTags = 5, initialTags = [], className = "" }) {
  const [tags, setTags] = useState(initialTags);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // Sync with external state changes
  useEffect(() => {
    const tagsChanged = JSON.stringify(tags) !== JSON.stringify(initialTags);
    if (tagsChanged) {
      setTags(initialTags);
    }
  }, [initialTags]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (error) setError(null); // Clear error on typing
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (!pastedData) return;

    const newTags = pastedData
      .split(/[\n,]+/) // Split by newline or comma
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // Process tags one by one to respect limits
    let currentTags = [...tags];
    let hasError = false;

    newTags.forEach(tag => {
      if (currentTags.length < maxTags && !currentTags.includes(tag)) {
        currentTags.push(tag);
      } else {
        hasError = true;
      }
    });

    setTags(currentTags);
    onTagsChange && onTagsChange(currentTags);

    if (hasError) {
      if (currentTags.length >= maxTags) {
        setError(`Maximum ${maxTags} tags allowed`);
      } else {
        // Could be massive duplicate list, just ignore or generic error
      }
    }
  };

  const addTag = (val) => {
    const trimmedValue = val.trim();
    if (!trimmedValue) return;

    if (tags.length >= maxTags) {
      setError(`Maximum ${maxTags} tags allowed`);
      return;
    }

    if (tags.includes(trimmedValue)) {
      setError(`Tag "${trimmedValue}" already exists`);
      return;
    }

    const newTags = [...tags, trimmedValue];
    setTags(newTags);
    setInputValue("");
    setError(null);
    onTagsChange && onTagsChange(newTags);
  };

  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    setError(null);
    onTagsChange && onTagsChange(newTags);
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={`w-full text-left ${className}`}>
      <div
        onClick={handleContainerClick}
        className={`flex min-h-[42px] w-full flex-wrap items-center gap-2 rounded-sm border bg-white px-3 py-2 transition-all duration-200 cursor-text
          ${error ? "border-red-600 focus-within:border-red-600 focus-within:bg-red-50" : "border-gray-200 focus-within:border-blue-500 focus-within:bg-gray-50"}
          outline-none`}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 rounded-sm bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 border border-blue-100"
          >
            {tag}
            <button
              type="button"
              className="group flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-800"
              onClick={(e) => {
                e.stopPropagation(); // Prevent container click
                removeTag(index);
              }}
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onPaste={handlePaste}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 border-none bg-transparent p-0 text-gray-800 placeholder-gray-400 focus:ring-0 outline-none text-sm"
          disabled={tags.length >= maxTags}
          autoComplete="off"
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 animate-pulse">
          {error}
        </p>
      )}

      {!error && tags.length >= maxTags && (
        <p className="mt-2 text-sm text-amber-600">
          Max tags reached
        </p>
      )}
    </div>
  );
}

export default TagsInput;
