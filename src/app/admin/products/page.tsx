"use client";

import React, { useEffect, useState, useRef } from "react";
import { X, Plus, Edit2, Trash2, Upload, Image as ImageIcon, Search, Filter } from "lucide-react";
import { formatPrice } from "@/utils/currency";

interface Product {
  id: number;
  name: string;
  description: string;
  amount: string;
  image_url: string;
  image_alt_text: string;
  minimum_order: number;
  category: string;
  delivery_time: string;
  finishing_options: string;
  material: string;
  specifications: string;
  availability_type?: string;
  is_available?: boolean;
  custom_price_note?: string;
  pre_order_note?: string;
}

const initialFormState = {
  id: 0,
  name: "",
  description: "",
  amount: "",
  image_url: "",
  image_alt_text: "",
  minimum_order: 1,
  category: "",
  delivery_time: "",
  finishing_options: "",
  material: "",
  specifications: "",
  availability_type: "in_stock",
  is_available: true,
  custom_price_note: "",
  pre_order_note: "",
};

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [uploading, setUploading] = useState(false);
  const cloudinaryRef = useRef<any>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    fetchProducts();
    loadCloudinaryWidget();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const loadCloudinaryWidget = () => {
    if (typeof window !== 'undefined' && !window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      script.onload = () => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget(
          {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset',
            multiple: false,
            maxFiles: 1,
            folder: 'graphics2prints_products',
            resourceType: 'image',
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
            maxFileSize: 10000000, // 10MB
            cropping: true,
            showAdvancedOptions: false,
            sources: ['local', 'url', 'camera'],
            theme: 'minimal',
            styles: {
              palette: {
                window: '#FFFFFF',
                windowBorder: '#90A0B3',
                tabIcon: '#0078FF',
                menuIcons: '#5A616A',
                textDark: '#000000',
                textLight: '#FFFFFF',
                link: '#0078FF',
                action: '#FF620C',
                inactiveTabIcon: '#0E2F5A',
                error: '#F44235',
                inProgress: '#0078FF',
                complete: '#20B832',
                sourceBg: '#E4EBF1'
              }
            },
            preBatch: (cb: any, data: any) => {
              setUploading(true);
              cb(data);
            }
          },
          (error: any, result: any) => {
            if (!error && result && result.event === 'success') {
              setForm(prev => ({
                ...prev,
                image_url: result.info.secure_url,
                image_alt_text: result.info.original_filename || form.name
              }));
              setUploading(false);
              setSuccess('Image uploaded successfully!');
              setTimeout(() => setSuccess(''), 3000);
            }
            if (error) {
              setUploading(false);
              setError('Failed to upload image');
            }
          }
        );
      };
      document.head.appendChild(script);
    }
  };

  const filterProducts = () => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    setFilteredProducts(filtered);
  };

  const getUniqueCategories = () => {
    return [...new Set(products.map(product => product.category))].filter(Boolean);
  };

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError("Error fetching products");
    }
    setLoading(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    
    // Special handling for availability_type changes
    if (name === 'availability_type') {
      const updatedForm = { ...form, [name]: value };
      
      // Clear amount when switching to custom_price
      if (value === 'custom_price') {
        updatedForm.amount = '';
      }
      
      // Clear conditional notes when switching types
      if (value !== 'pre_order') {
        updatedForm.pre_order_note = '';
      }
      if (value !== 'custom_price') {
        updatedForm.custom_price_note = '';
      }
      
      setForm(updatedForm);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function openModal(product?: Product) {
    if (product) {
      setForm({
        id: product.id,
        name: product.name,
        description: product.description,
        amount: product.amount.toString(),
        image_url: product.image_url,
        image_alt_text: product.image_alt_text,
        minimum_order: product.minimum_order,
        category: product.category,
        delivery_time: product.delivery_time,
        finishing_options: product.finishing_options,
        material: product.material,
        specifications: product.specifications,
        availability_type: product.availability_type || "in_stock",
        is_available: product.is_available ?? true,
        custom_price_note: product.custom_price_note || "",
        pre_order_note: product.pre_order_note || "",
      });
      setIsEditing(true);
    } else {
      setForm(initialFormState);
      setIsEditing(false);
    }
    setShowModal(true);
    setError("");
    setSuccess("");
  }

  function closeModal() {
    setShowModal(false);
    setForm(initialFormState);
    setIsEditing(false);
    setError("");
    setSuccess("");
  }

  function openCloudinaryWidget() {
    if (widgetRef.current) {
      setUploading(true);
      setError("");
      try {
        widgetRef.current.open();
      } catch (error) {
        console.error("Cloudinary widget error:", error);
        setUploading(false);
        setError('Failed to open image uploader. Please try again.');
      }
    } else {
      setError('Image uploader not ready. Please refresh the page and try again.');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Prevent double submission
    if (loading) return;
    
    setError("");
    setSuccess("");

    // Validation
    if (!form.name || !form.minimum_order || !form.category) {
      setError("Please fill in all required fields.");
      return;
    }

    // For custom pricing, skip amount validation but ensure other fields are valid
    if (form.availability_type === 'custom_price') {
      // Custom price validation - amount is optional
    } else if (!form.amount || parseFloat(form.amount) <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!form.image_url) {
      setError("Please upload an image.");
      return;
    }

    const payload = {
      ...form,
      amount: form.availability_type === 'custom_price' ? 0 : (parseFloat(form.amount) || 0),
      minimum_order: Number(form.minimum_order),
    };

    try {
      setLoading(true);
      setError("");
      
      // Add timeout for mobile networks
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const res = await fetch("/api/products", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        closeModal();
        setSuccess(isEditing ? "Product updated successfully!" : "Product added successfully!");
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || "Failed to save product");
      }
    } catch (err: any) {
      console.error("Product save error:", err);
      if (err.name === 'AbortError') {
        setError("Request timed out. Please check your connection and try again.");
      } else if (err.message?.includes('fetch')) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(err.message || "Error saving product");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    
    try {
      setLoading(true);
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        setSuccess("Product deleted successfully!");
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || "Failed to delete product");
      }
    } catch (err) {
      setError("Error deleting product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section-with-header-spacing min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog with ease</p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <X className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <div className="w-5 h-5 mr-2 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            {success}
          </div>
        )}

        {/* Controls */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[150px]"
                >
                  <option value="">All Categories</option>
                  {getUniqueCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Add Product Button */}
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || categoryFilter ? 'Try adjusting your search or filter criteria.' : 'Get started by adding your first product.'}
            </p>
            {!searchTerm && !categoryFilter && (
              <button
                onClick={() => openModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add Your First Product
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.image_alt_text}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 text-sm font-semibold text-gray-700 shadow">
                    ₦{formatPrice(parseFloat(product.amount))}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                      {product.category}
                    </p>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mb-4">
                    <div>Min Order: {product.minimum_order}</div>
                    <div>Delivery: {product.delivery_time}</div>
                    <div className="col-span-2">Material: {product.material}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(product)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {isEditing ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Product Image</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image
                      </label>
                      <button
                        type="button"
                        onClick={openCloudinaryWidget}
                        disabled={uploading}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
                      >
                        {uploading ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-600">
                          {uploading ? 'Uploading...' : 'Click to upload image'}
                        </span>
                      </button>
                    </div>
                    
                    {form.image_url && (
                      <div className="relative w-32 h-32">
                        <img
                          src={form.image_url}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, image_url: "" })}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 text-xs transition-colors shadow-lg"
                          title="Remove image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image Alt Text *
                    </label>
                    <input
                      type="text"
                      name="image_alt_text"
                      value={form.image_alt_text}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Describe the image for accessibility"
                      required
                    />
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₦) {form.availability_type !== 'custom_price' ? '*' : ''}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="amount"
                      value={form.amount}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required={form.availability_type !== 'custom_price'}
                      disabled={form.availability_type === 'custom_price'}
                      placeholder={form.availability_type === 'custom_price' ? 'Custom pricing - no fixed price' : ''}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={form.category}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Order *
                    </label>
                    <input
                      type="number"
                      name="minimum_order"
                      value={form.minimum_order}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Availability Type *
                    </label>
                    <select
                      name="availability_type"
                      value={form.availability_type}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="pre_order">Pre-Order</option>
                      <option value="custom_price">Custom Price</option>
                    </select>
                  </div>
                </div>

                {/* Conditional fields based on availability type */}
                {form.availability_type === 'pre_order' && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pre-Order Note
                    </label>
                    <textarea
                      name="pre_order_note"
                      value={form.pre_order_note}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., Available for pre-order, ships in 2-3 weeks"
                    />
                    <p className="text-xs text-blue-600 mt-1">This note will be shown to customers for pre-order items.</p>
                  </div>
                )}

                {form.availability_type === 'custom_price' && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Price Note
                    </label>
                    <textarea
                      name="custom_price_note"
                      value={form.custom_price_note}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., Price varies based on quantity and specifications"
                    />
                    <p className="text-xs text-yellow-600 mt-1">Customers will need to contact you for pricing information.</p>
                  </div>
                )}

                {/* Additional Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Time *
                    </label>
                    <input
                      type="text"
                      name="delivery_time"
                      value={form.delivery_time}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., 3-5 business days"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material *
                    </label>
                    <input
                      type="text"
                      name="material"
                      value={form.material}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Detailed product description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Finishing Options *
                    </label>
                    <input
                      type="text"
                      name="finishing_options"
                      value={form.finishing_options}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., Matte, Glossy, UV Coating"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specifications *
                    </label>
                    <input
                      type="text"
                      name="specifications"
                      value={form.specifications}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., 300 GSM, A4 Size, CMYK"
                      required
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        {isEditing ? "Update Product" : "Add Product"}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
