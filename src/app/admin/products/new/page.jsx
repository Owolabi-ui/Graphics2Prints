// src/app/admin/products/new/page.jsx
import ProductForm from '@/components/admin/ProductForm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export const metadata = {
  title: 'Add New Product | Graphics2Prints',
  description: 'Add a new product to your store',
};

export default async function NewProductPage() {
  // Check authentication and admin status
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user.isAdmin) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">You do not have permission to access this page.</p>
        <Link href="/" className="text-blue-500 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <Link href="/admin/products" className="text-blue-500 hover:underline">
          &larr; Back to Products
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <ProductForm />
      </div>
    </div>
  );
}
