"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';

interface DesignUploaderProps {
  productName?: string;
  productId?: string;
  onUploadComplete?: (uploadData: any) => void;
}

export default function DesignUploader({ 
  productName, 
  productId, 
  onUploadComplete 
}: DesignUploaderProps) {
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    if (!session?.user?.email) {
      setUploadStatus('Please log in to upload designs');
      return;
    }

    const file = files[0];
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus('Please upload only images (JPG, PNG, GIF) or PDF files');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('customer_email', session.user.email);
      formData.append('file_name', file.name);
      
      if (productName) {
        formData.append('product_name', productName);
      }
      if (productId) {
        formData.append('product_id', productId);
      }

      const response = await fetch('/api/upload-designs', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUploadStatus('Design uploaded successfully! We will review it and get back to you.');
        if (onUploadComplete) {
          onUploadComplete(result.data);
        }
      } else {
        setUploadStatus(result.error || 'Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">Please log in to upload your design files</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <CloudArrowUpIcon className="h-5 w-5 mr-2" />
        Upload Your Design
      </h3>
      
      {productName && (
        <p className="text-sm text-gray-600 mb-4">
          Uploading design for: <span className="font-medium">{productName}</span>
        </p>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept="image/*,.pdf"
          disabled={uploading}
        />
        
        <div className="space-y-2">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span>{' '}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            Images (JPG, PNG, GIF) or PDF up to 10MB
          </p>
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {uploadStatus && (
        <div className={`mt-4 p-3 rounded-md text-sm ${
          uploadStatus.includes('successfully') 
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {uploadStatus}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>• Supported formats: JPG, PNG, GIF, PDF</p>
        <p>• Maximum file size: 10MB</p>
        <p>• High resolution files recommended for best print quality</p>
      </div>
    </div>
  );
}
