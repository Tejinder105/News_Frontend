import React, { useState, useRef } from "react";
import { Input, Toggle, Spinner,TagsInput } from "../../../Components";
import { FastForward, Upload, X, AlertCircle } from "lucide-react";

export default function ArticleSidebar({
  post,
  register,
  errors,
  tags,
  setTags,
  loading,
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(post?.featured_image || null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  // File validation
  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid image file (JPG, PNG, GIF, WebP)";
    }
    
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }
    
    return null;
  };

  // Handle file selection
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

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle click to upload
  const handleClick = (e) => {
    console.log('Upload area clicked, opening file dialog...');
    console.log('File input ref:', fileInputRef.current);
    
    // Try to get the file input element directly if ref fails
    const fileInput = fileInputRef.current || document.getElementById('featured_image');
    
    if (fileInput) {
      console.log('Triggering file input click...');
      fileInput.click();
    } else {
      console.error('File input element not found');
    }
  };

  // Remove selected image
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
      {/* Hidden File Input - Always rendered */}
      <input
        ref={fileInputRef}
        id="featured_image"
        type="file"
        accept="image/*"
        className="hidden"
        {...register("featured_image", {
          required: !post && "Featured image is required",
          onChange: (e) => {
            console.log('File input onChange triggered:', e.target.files);
            if (e.target.files && e.target.files[0]) {
              console.log('Selected file:', e.target.files[0]);
              handleFileSelect(e.target.files[0]);
            } else {
              console.log('No file selected');
            }
          }
        })}
        aria-label="Upload featured image"
      />
      
      <div className="mb-4 sm:mb-6 rounded-lg sm:rounded-xl border border-gray-100 bg-white p-3 sm:p-4 shadow-lg ">
        <label
          className="mb-2 block text-xs sm:text-sm font-medium text-gray-700 cursor-pointer"
          htmlFor="featured_image"
          onClick={handleClick}
        >
          Featured Image
        </label>
        
        {/* Image Preview */}
        {imagePreview ? (
          <div className="relative mb-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
              {selectedImage ? selectedImage.name : 'Current image'}
            </div>
          </div>
        ) : (
          /* Upload Area */
          <label
            htmlFor="featured_image"
            className={`flex items-center justify-center rounded-lg border-2 border-dashed px-3 py-6 sm:px-6 sm:py-10 cursor-pointer transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <div className={`mx-auto mb-2 sm:mb-3 flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full ${
                dragActive ? 'bg-blue-200' : 'bg-blue-100'
              }`}>
                <Upload size={16} strokeWidth={2} className="text-blue-600 sm:w-6 sm:h-6" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium text-blue-600">Click to upload</span>
                <span className="hidden sm:inline">{" "}or drag and drop</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP up to 5MB</p>
            </div>
          </label>
        )}
        
        {/* Error Messages */}
        {(errors.featured_image || uploadError) && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={16} />
            <span>{errors.featured_image?.message || uploadError}</span>
          </div>
        )}
        
        {/* Upload Instructions */}
        {!imagePreview && (
          <div className="mt-3 text-xs text-gray-500">
            <p>• Recommended size: 1200x630px for best results</p>
            <p>• Supported formats: JPG, PNG, GIF, WebP</p>
            <p>• Maximum file size: 5MB</p>
          </div>
        )}
        
        <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5 sm:p-3">
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-gray-700">
                Featured Article
              </h4>
            </div>
            <Toggle {...register("is_featured")} />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5 sm:p-3">
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-gray-700">
                Breaking News
              </h4>
            </div>
            <Toggle {...register("is_breaking")} />
          </div>
        </div>
      </div>
      <div className="mb-4 sm:mb-6 rounded-lg sm:rounded-xl border border-gray-100 bg-white p-3 sm:p-6 shadow-lg">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">Tags</h3>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium text-gray-600">
            {tags.length} / 10
          </span>
        </div>
        <TagsInput
          value={tags}
          onTagsChange={setTags}
          placeholder="Add article tags..."
          maxTags={10}
        />
        <div className="mt-3 sm:mt-4 flex flex-col gap-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">YouTube Link</h3>
          <Input
            placeholder="https://youtube.com/watch?v=..."
            className="mb-1 text-sm"
            {...register("youtube_link")}
            error={errors.youtube_link}
          />
        </div>
      </div>
      <div className="rounded-lg sm:rounded-xl border border-gray-100 bg-white p-3 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="submit"
            name="action"
            value="draft"
            disabled={loading}
            className="flex flex-1 items-center justify-center rounded-lg bg-blue-100 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-blue-700 shadow-md transition-all duration-200 hover:bg-blue-200 disabled:opacity-50"
          >
            {loading ? <Spinner size="sm" className="mr-1 sm:mr-2" /> : null}
            Save as Draft
          </button>
          <button
            type="submit"
            name="action"
            value="publish"
            disabled={loading}
            className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all duration-200 ${
              post
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } disabled:opacity-50`}
          >
            {loading ? <Spinner size="sm" className="mr-1 sm:mr-2" /> : null}
            <span className="truncate">{post ? "Update & Publish" : "Publish Article"}</span>
            <FastForward size={14} className="ml-1 sm:ml-2 flex-shrink-0" />
          </button>
        </div>
      </div>
    </>
  );
}
