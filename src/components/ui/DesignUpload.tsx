"use client";
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DesignUploadProps {
  orderId?: string;
  customerId?: string;
  onUploadComplete?: (uploadData: { url: string; publicId: string }) => void;
}

export default function DesignUpload({ orderId, customerId, onUploadComplete }: DesignUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; publicId: string; name: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload only image files (JPEG, PNG, GIF, WebP) or PDF files');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (orderId) formData.append('orderId', orderId);
      if (customerId) formData.append('customerId', customerId);

      const response = await fetch('/api/upload-designs', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const uploadData = {
          url: result.data.url,
          publicId: result.data.publicId,
          name: file.name
        };
        
        setUploadedFiles(prev => [...prev, uploadData]);
        onUploadComplete?.(uploadData);
        toast.success('Design uploaded successfully!');
      } else {
        toast.error(result.error || 'Failed to upload design');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload design');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    
    for (const file of Array.from(files)) {
      uploadFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Upload Your Design Files
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
        Upload your design files (images or PDF) that you want us to print. Maximum file size: 10MB per file.
      </p>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-[#FF0000] transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Drag and drop files here, or click to select
        </p>
        <p className="text-xs text-gray-500">
          Supports: JPEG, PNG, GIF, WebP, PDF (max 10MB each)
        </p>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-800 text-sm">Uploading design...</span>
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Uploaded Files:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <DocumentIcon className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 text-sm font-medium">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Design Guidelines:</h4>
        <ul className="text-yellow-700 text-xs space-y-1">
          <li>• High resolution images (300 DPI recommended)</li>
          <li>• Vector files (AI, EPS) are preferred for best quality</li>
          <li>• Ensure text is converted to outlines/curves</li>
          <li>• Include bleed area if required for your product</li>
          <li>• Contact us if you need help with design specifications</li>
        </ul>
      </div>
    </div>
  );
}
