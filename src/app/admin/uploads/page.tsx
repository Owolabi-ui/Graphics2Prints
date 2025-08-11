"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  DocumentIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface DesignUpload {
  id: number;
  order_reference: string | null;
  customer_id: number | null;
  file_name: string;
  cloudinary_url: string;
  cloudinary_public_id: string;
  file_type: string;
  file_size: number;
  upload_status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  customer: {
    name: string;
    email: string;
  } | null;
}

export default function DesignUploadsAdmin() {
  const [uploads, setUploads] = useState<DesignUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUpload, setSelectedUpload] = useState<DesignUpload | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUploads();
  }, [selectedStatus]);

  const fetchUploads = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }
      
      const response = await fetch(`/api/upload-designs?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setUploads(result.data);
      } else {
        toast.error('Failed to fetch uploads');
      }
    } catch (error) {
      console.error('Error fetching uploads:', error);
      toast.error('Error fetching uploads');
    } finally {
      setLoading(false);
    }
  };

  const updateUploadStatus = async (uploadId: number, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/upload-designs/${uploadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          upload_status: status,
          admin_notes: notes
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`Upload status updated to ${status}`);
        fetchUploads();
        setShowModal(false);
        setSelectedUpload(null);
        setAdminNotes('');
      } else {
        toast.error('Failed to update upload status');
      }
    } catch (error) {
      console.error('Error updating upload:', error);
      toast.error('Error updating upload');
    }
  };

  const deleteUpload = async (uploadId: number) => {
    if (!confirm('Are you sure you want to delete this upload?')) return;

    try {
      const response = await fetch(`/api/upload-designs/${uploadId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Upload deleted successfully');
        fetchUploads();
      } else {
        toast.error('Failed to delete upload');
      }
    } catch (error) {
      console.error('Error deleting upload:', error);
      toast.error('Error deleting upload');
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

  if (loading) return <div className="p-6">Loading uploads...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customer Design Uploads
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Review and manage customer uploaded design files
        </p>
      </div>

      {/* Filter Controls */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Status:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Uploads Table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {uploads.map((upload) => (
            <li key={upload.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DocumentIcon className="h-10 w-10 text-gray-400" />
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {upload.file_name}
                      </h3>
                      <span className={getStatusBadge(upload.upload_status)}>
                        {getStatusIcon(upload.upload_status)}
                        <span className="ml-1">{upload.upload_status}</span>
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <p>Size: {formatFileSize(upload.file_size)} | Type: {upload.file_type}</p>
                      <p>Order: {upload.order_reference || 'N/A'}</p>
                      <p>Customer: {upload.customer?.name || 'Unknown'} ({upload.customer?.email || 'N/A'})</p>
                      <p>Uploaded: {new Date(upload.created_at).toLocaleDateString()}</p>
                      {upload.admin_notes && (
                        <p className="mt-1 text-yellow-600">Notes: {upload.admin_notes}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(upload.cloudinary_url, '_blank')}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedUpload(upload);
                      setAdminNotes(upload.admin_notes || '');
                      setShowModal(true);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                  >
                    Review
                  </button>
                  
                  <button
                    onClick={() => deleteUpload(upload.id)}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {uploads.length === 0 && (
          <div className="text-center py-12">
            <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No uploads found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No design uploads match the current filter.
            </p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && selectedUpload && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Review: {selectedUpload.file_name}
              </h3>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Notes:
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Add notes about this design..."
                />
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => updateUploadStatus(selectedUpload.id, 'approved', adminNotes)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateUploadStatus(selectedUpload.id, 'rejected', adminNotes)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => updateUploadStatus(selectedUpload.id, 'reviewed', adminNotes)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Mark Reviewed
                </button>
              </div>
              
              <div className="mt-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedUpload(null);
                    setAdminNotes('');
                  }}
                  className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
