"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface MigrationResult {
  success: boolean;
  error?: string;
  message?: string;
  existingColumns?: number;
  updatedProducts?: number;
  [key: string]: any;
}

export default function MigrationPage() {
  const { data: session } = useSession();
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);

  const runMigration = async () => {
    if (!session?.user?.email?.includes('graphics2prints@gmail.com')) {
      toast.error('Unauthorized: Admin access required');
      return;
    }

    setIsRunning(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/migrate-product-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorization: 'migrate-product-availability-2025'
        })
      });

      const data = await response.json();
      setResult(data);

      if (response.ok && data.success) {
        toast.success('Migration completed successfully!');
      } else {
        toast.error('Migration failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('Failed to run migration');
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (!session?.user?.email?.includes('graphics2prints@gmail.com')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Product Availability Migration
          </h1>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              What this migration does:
            </h2>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>Adds availability_type field (in_stock, pre_order, custom_price)</li>
              <li>Adds is_available boolean flag</li>
              <li>Adds custom_price_note and pre_order_note fields</li>
              <li>Updates existing products with default values</li>
              <li>Safe operation - preserves all existing data</li>
            </ul>
          </div>

          <button
            onClick={runMigration}
            disabled={isRunning}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              isRunning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isRunning ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Running Migration...
              </span>
            ) : (
              'Run Production Migration'
            )}
          </button>

          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Migration Result:</h3>
              <div className={`p-4 rounded-lg ${
                result.success ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              ⚠️ Important Notes:
            </h3>
            <ul className="list-disc list-inside text-yellow-800 space-y-1">
              <li>This migration is safe and will not delete any existing data</li>
              <li>Run this only once - it will detect if already applied</li>
              <li>After successful migration, new product form fields will appear</li>
              <li>Contact support if you encounter any issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
