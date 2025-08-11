"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  DocumentIcon, 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

interface DesignUpload {
  id: number;
  order_reference: string | null;
  file_name: string;
  cloudinary_url: string;
  file_type: string;
  file_size: number;
  upload_status: string;
  admin_notes: string | null;
  created_at: string;
}

export default function MyUploads() {
  const { data: session } = useSession();
  const [uploads, setUploads] = useState<DesignUpload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetchMyUploads();
    }
  }, [session]);

  const fetchMyUploads = async () => {
    try {
      // Note: You'll need to modify this to get customer ID from session
      const response = await fetch('/api/upload-designs');
      const result = await response.json();
      
      if (result.success) {
        setUploads(result.data);
      }
    } catch (error) {
      console.error('Error fetching uploads:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'reviewed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'rejected':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Your design has been approved and is ready for production!';
      case 'rejected':
        return 'Your design needs some adjustments. Please check the notes below.';
      case 'reviewed':
        return 'Your design has been reviewed by our team.';
      default:
        return 'Your design is pending review by our team.';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Design Uploads
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track the status of your uploaded design files
        </p>
      </div>

      {uploads.length === 0 ? (
        <div className="text-center py-12">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No uploads yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You haven't uploaded any design files yet. Upload your designs after completing a purchase.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <DocumentIcon className="h-10 w-10 text-gray-400 mt-1" />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {upload.file_name}
                      </h3>
                      <span className={getStatusBadge(upload.upload_status)}>
                        {getStatusIcon(upload.upload_status)}
                        <span className="ml-1 capitalize">{upload.upload_status}</span>
                      </span>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>Size: {formatFileSize(upload.file_size)} | Type: {upload.file_type}</p>
                      <p>Order Reference: {upload.order_reference || 'N/A'}</p>
                      <p>Uploaded: {new Date(upload.created_at).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="mt-3">
                      <p className={`text-sm ${
                        upload.upload_status === 'approved' ? 'text-green-600' :
                        upload.upload_status === 'rejected' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {getStatusMessage(upload.upload_status)}
                      </p>
                      
                      {upload.admin_notes && (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Notes from our team:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {upload.admin_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <button
                    onClick={() => window.open(upload.cloudinary_url, '_blank')}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
