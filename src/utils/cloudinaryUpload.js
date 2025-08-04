// src/utils/cloudinaryUpload.js
// Utility functions for uploading images to Cloudinary from the admin panel

/**
 * Upload an image file to Cloudinary
 * @param {File} file - The image file to upload
 * @param {string} folder - The folder in Cloudinary to upload to
 * @returns {Promise<string|null>} - The Cloudinary URL or null if upload failed
 */
export async function uploadImageToCloudinary(file, folder = 'graphics2prints_products') {
  if (!file || !file.type.startsWith('image/')) {
    console.error('Please select a valid image file');
    return null;
  }

  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  try {
    console.log('Starting upload to Cloudinary...');
    console.log('Cloud name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    console.log('Upload preset:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    // Upload to Cloudinary using the upload preset (unsigned upload)
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', response.statusText, errorText);
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Upload successful:', data.secure_url);
    
    // Return the secure URL from the response
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return null;
  }
}

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<boolean>} - Whether the deletion was successful
 */
export async function deleteImageFromCloudinary(publicId) {
  if (!publicId) return false;

  try {
    // Call your API endpoint that handles Cloudinary deletion
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error(`Deletion failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
}

/**
 * Extract the public ID from a Cloudinary URL
 * @param {string} url - The Cloudinary URL
 * @returns {string|null} - The public ID or null if not a valid Cloudinary URL
 */
export function getPublicIdFromUrl(url) {
  if (!url || !url.includes('cloudinary.com')) return null;

  try {
    // Parse URL to extract the public ID
    // Format: https://res.cloudinary.com/cloud_name/image/upload/folder/public_id
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) return null;
    
    // Everything after 'upload' is the folder and public ID
    const publicIdWithFolder = urlParts.slice(uploadIndex + 1).join('/');
    
    // Remove any file extension if present
    return publicIdWithFolder.split('.')[0];
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
}
