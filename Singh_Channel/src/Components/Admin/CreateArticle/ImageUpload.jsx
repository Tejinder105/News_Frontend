import React, { useState, useRef, useEffect } from "react";
import { Upload, X, AlertCircle } from "lucide-react";
function ImageUpload({ register, error, post, watch }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    post?.image || null
  );
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  // Watch for form reset
  const featuredImageValue = watch ? watch("featuredImage") : null;

  useEffect(() => {
    // If not editing an existing post, and the form field is empty/null, clear the preview
    // This handles the form reset() case
    if (!post && (!featuredImageValue || featuredImageValue.length === 0)) {
      setImagePreview(null);
      setSelectedImage(null);
    }
  }, [featuredImageValue, post]);

  useEffect(() => {
    if (post?.image) {
      setImagePreview(post.image);
      setSelectedImage(null); // Reset selected image when editing existing post
    } else {
      // Only force clear if also no local preview? 
      // This runs on mount or post change.
      // If we are in create mode, post is null. 
      // Do not force clear here as it might conflict with file selection if post prop updates (unlikely in create mode)
      // Actually the original logic was:
      // } else { setImagePreview(null); }
      // This is fine for initial load.
    }
  }, [post]);

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid image file (JPG, PNG, GIF)";
    }

    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    return null;
  };

  const handleFileSelect = (file) => {
    setUploadError("");

    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Try to get the file input element directly if ref fails
    const fileInput =
      fileInputRef.current || document.getElementById("featuredImage");

    if (fileInput) {
      try {
        fileInput.click();
      } catch (error) {
        console.error("Error clicking file input:", error);
      }
    } else {
      console.error("File input element not found");
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="group relative mb-6 overflow-hidden rounded-sm border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-300 hover:shadow-md">
        <div className="mb-3 flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-blue-50 text-blue-600">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold font-serif text-gray-800 sm:text-base">
              Featured Image
            </h4>
          </div>
        </div>

        <input
          id="featuredImage"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif"
          className="hidden"
          {...(() => {
            const { ref: registerRef, ...rest } = register("featuredImage", {
              required: !post && "Featured image is required",
              onChange: (e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              },
            });
            return {
              ...rest,
              ref: (e) => {
                registerRef(e);
                fileInputRef.current = e;
              },
            };
          })()}
          aria-label="Upload featured image"
        />

        {/* Image Preview */}
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-48 w-full rounded-lg border border-gray-200 object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
            <div className="bg-opacity-50 absolute bottom-2 left-2 rounded bg-black px-2 py-1 text-xs text-white">
              {selectedImage ? selectedImage.name : "Current image"}
            </div>
          </div>
        ) : (
          /* Upload Area */
          <label
            htmlFor="featuredImage"
            className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-3 py-6 transition-colors sm:px-6 sm:py-10 ${dragActive
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <div className="text-center">
              <div
                className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full sm:mb-3 sm:h-12 sm:w-12 ${dragActive ? "bg-blue-200" : "bg-blue-100"
                  }`}
              >
                <Upload
                  size={16}
                  strokeWidth={2}
                  className="text-blue-600 sm:h-6 sm:w-6"
                />
              </div>
              <p className="text-xs text-gray-600 sm:text-sm">
                <span className="font-medium text-blue-600">
                  Click to upload
                </span>
                <span className="hidden sm:inline"> or drag and drop</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </label>
        )}

        {/* Error Messages */}
        {(error || uploadError) && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={16} />
            <span>{error?.message || uploadError}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default React.memo(ImageUpload);
