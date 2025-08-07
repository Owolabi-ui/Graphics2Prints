// src/components/admin/ProductForm.jsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import ImageUploader from './ImageUploader';

/**
 * Enhanced Product form for admin panel with availability types
 * @param {Object} props
 * @param {Object} props.product - Product data when editing (optional)
 * @returns {JSX.Element}
 */
export default function ProductForm({ product = null }) {
  const router = useRouter();
  const isEditing = !!product;
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.amount || product?.price || '', // Handle both 'amount' and 'price'
    image_url: product?.image_url || '',
    category: product?.category || 'Prints', // Changed from category_id to category
    minimum_order: product?.minimum_order || 1,
    delivery_time: product?.delivery_time || '3-5 business days',
    finishing_options: product?.finishing_options || 'Standard',
    material: product?.material || 'Standard',
    specifications: product?.specifications || '',
    image_alt_text: product?.image_alt_text || '',
    availability_type: product?.availability_type || 'in_stock',
    is_available: product?.is_available !== undefined ? product.is_available : true,
    custom_price_note: product?.custom_price_note || '',
    pre_order_note: product?.pre_order_note || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUploaded = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image_url: imageUrl
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast.error('Please fill in product name and price');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // API endpoint URL based on whether we're creating or updating
      const url = isEditing 
        ? `/api/admin/products/${product.id}` 
        : '/api/admin/products';
      
      // HTTP method based on whether we're creating or updating
      const method = isEditing ? 'PUT' : 'POST';
      
      console.log('Submitting product data:', formData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      toast.success(isEditing ? 'Product updated successfully!' : 'Product created successfully!');
      
      // Redirect to products list
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error('Error submitting product:', error);
      
      // More specific error messages
      if (error.message.includes('timeout')) {
        toast.error('Connection timeout. Please check your internet and try again.');
      } else if (error.message.includes('already exists')) {
        toast.error('A product with this name already exists.');
      } else {
        toast.error(error.message || 'Failed to save product. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (Amount) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required={formData.availability_type !== 'custom_price'}
              min="0"
              step="0.01"
              disabled={formData.availability_type === 'custom_price'}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
            {formData.availability_type === 'custom_price' && (
              <p className="mt-1 text-sm text-gray-500">Price not applicable for custom pricing products</p>
            )}
          </div>

          <div>
            <label htmlFor="availability_type" className="block text-sm font-medium text-gray-700">
              Availability Type *
            </label>
            <select
              id="availability_type"
              name="availability_type"
              value={formData.availability_type}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="in_stock">In Stock (Regular)</option>
              <option value="pre_order">Pre-Order</option>
              <option value="custom_price">Custom Price (Contact for Quote)</option>
            </select>
          </div>

          {formData.availability_type === 'pre_order' && (
            <div>
              <label htmlFor="pre_order_note" className="block text-sm font-medium text-gray-700">
                Pre-Order Note
              </label>
              <textarea
                id="pre_order_note"
                name="pre_order_note"
                value={formData.pre_order_note}
                onChange={handleChange}
                rows={2}
                placeholder="e.g., Expected availability in 2-3 weeks, requires 50% deposit"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          {formData.availability_type === 'custom_price' && (
            <div>
              <label htmlFor="custom_price_note" className="block text-sm font-medium text-gray-700">
                Custom Price Instructions
              </label>
              <textarea
                id="custom_price_note"
                name="custom_price_note"
                value={formData.custom_price_note}
                onChange={handleChange}
                rows={2}
                placeholder="e.g., Contact us for bulk pricing, depends on size and quantity"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              <option value="Prints">Prints</option>
              <option value="Gift Items">Gift Items</option>
              <option value="Business Cards">Business Cards</option>
              <option value="Banners">Banners</option>
              <option value="Stickers">Stickers</option>
              <option value="Promotional Items">Promotional Items</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="minimum_order" className="block text-sm font-medium text-gray-700">
              Minimum Order Quantity *
            </label>
            <input
              type="number"
              id="minimum_order"
              name="minimum_order"
              value={formData.minimum_order}
              onChange={handleChange}
              required
              min="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="delivery_time" className="block text-sm font-medium text-gray-700">
              Delivery Time *
            </label>
            <input
              type="text"
              id="delivery_time"
              name="delivery_time"
              value={formData.delivery_time}
              onChange={handleChange}
              required
              placeholder="e.g., 3-5 business days"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="material" className="block text-sm font-medium text-gray-700">
              Material *
            </label>
            <input
              type="text"
              id="material"
              name="material"
              value={formData.material}
              onChange={handleChange}
              required
              placeholder="e.g., Premium paper, Canvas, Metal"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="finishing_options" className="block text-sm font-medium text-gray-700">
              Finishing Options *
            </label>
            <textarea
              id="finishing_options"
              name="finishing_options"
              value={formData.finishing_options}
              onChange={handleChange}
              required
              rows={2}
              placeholder="e.g., Matte, Glossy, Laminated"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="specifications" className="block text-sm font-medium text-gray-700">
              Specifications *
            </label>
            <textarea
              id="specifications"
              name="specifications"
              value={formData.specifications}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Detailed product specifications"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_available"
              name="is_available"
              checked={formData.is_available}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="is_available" className="ml-2 block text-sm text-gray-700">
              Available for Purchase
            </label>
          </div>
        </div>

        <div>
          {/* Image uploader component */}
          <ImageUploader
            currentImageUrl={formData.image_url}
            onImageUploaded={handleImageUploaded}
            folder="graphics2prints_products"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
