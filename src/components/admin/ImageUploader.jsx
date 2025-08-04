// src/components/admin/ImageUploader.jsx
"use client";

import { useState, useRef } from 'react';
import { uploadImageToCloudinary } from '@/utils/cloudinaryUpload';
import Image from 'next/image';

/**
 * Image uploader component for admin panel
 * @param {Object} props
 * @param {string} props.currentImageUrl - Current image URL if editing
 * @param {function} props.onImageUploaded - Callback when image is uploaded (receives the Cloudinary URL)
 * @param {string} props.folder - Cloudinary folder to upload to
 * @returns {JSX.Element}
 */
export default function ImageUploader({ currentImageUrl = "", onImageUploaded, folder = "graphics2prints_products" }) {
  const [imageUrl, setImageUrl] = useState(currentImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    await processFile(file);
  };

  const processFile = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      // Upload the image to Cloudinary
      const cloudinaryUrl = await uploadImageToCloudinary(file, folder);
      
      if (cloudinaryUrl) {
        setImageUrl(cloudinaryUrl);
        // Call the callback with the new image URL
        if (onImageUploaded) {
          onImageUploaded(cloudinaryUrl);
        }
      } else {
        setError("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("An error occurred while uploading the image.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      processFile(file);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>

        <div 
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-50' 
              : isUploading 
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                : 'border-gray-300 hover:bg-gray-50'
          }`}
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {imageUrl ? (
            <div className="relative w-full aspect-square max-w-xs mx-auto">
              <Image
                src={imageUrl}
                alt="Product image"
                fill
                className="object-contain rounded-md"
              />
              {!isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm opacity-0 hover:opacity-100 transition-opacity">
                    Click to change image
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-2"></div>
                  <p className="text-sm text-gray-500">Uploading...</p>
                </div>
              ) : (
                <>
                  <svg 
                    className="mx-auto h-12 w-12 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    {isDragging ? 'Drop the image here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG, JPEG, WEBP up to 10MB
                  </p>
                </>
              )}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={isUploading}
          />
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}

        {imageUrl && !isUploading && (
          <p className="mt-2 text-sm text-gray-500">
            Click the image area to upload a different image
          </p>
        )}
      </div>
    </div>
  );
}
