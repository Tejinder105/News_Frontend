import React, { useState, useRef, useEffect } from "react";
import { Upload, X, AlertCircle } from "lucide-react";
function ImageUpload({ register, errors, post }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    post?.image || null
  );
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  console.log("ImageUpload component rendered with:", { post, errors });

  // Update image preview when post changes
  useEffect(() => {
    if (post?.image) {
      setImagePreview(post.image);
      setSelectedImage(null); // Reset selected image when editing existing post
    } else {
      setImagePreview(null);
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
    console.log("Upload area clicked, opening file dialog...");
    console.log("File input ref:", fileInputRef.current);

    // Try to get the file input element directly if ref fails
    const fileInput =
      fileInputRef.current || document.getElementById("featuredImage");

    if (fileInput) {
      console.log("Triggering file input click...");
      try {
        fileInput.click();
        console.log("File input click triggered successfully");
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
      <input
        ref={fileInputRef}
        id="featuredImage"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        className="hidden"
        {...register("featuredImage", {
          required: !post && "Featured image is required",
          onChange: (e) => {
            console.log("File input onChange triggered:", e.target.files);
            if (e.target.files && e.target.files[0]) {
              console.log("Selected file:", e.target.files[0]);
              handleFileSelect(e.target.files[0]);
            } else {
              console.log("No file selected");
            }
          },
        })}
        aria-label="Upload featured image"
      />

      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <label
            className="cursor-pointer text-xs font-medium text-gray-700 sm:text-sm"
            htmlFor="featuredImage"
          >
            Featured Image
          </label>
          {/* Debug button - remove this later */}
          <button
            type="button"
            onClick={() => {
              console.log("Debug button clicked");
              const input = document.getElementById("featuredImage");
              console.log("Found input:", input);
              if (input) {
                input.click();
              }
            }}
            className="text-xs bg-gray-200 px-2 py-1 rounded"
          >
            Test Upload
          </button>
        </div>

        {/* Image Preview */}
        {imagePreview ? (
          <div className="relative mb-4">
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
            className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-3 py-6 transition-colors sm:px-6 sm:py-10 ${
              dragActive
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
                className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full sm:mb-3 sm:h-12 sm:w-12 ${
                  dragActive ? "bg-blue-200" : "bg-blue-100"
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
        {(errors.featuredImage || uploadError) && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={16} />
            <span>{errors.featuredImage?.message || uploadError}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default ImageUpload;
