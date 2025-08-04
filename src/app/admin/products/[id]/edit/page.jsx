// src/app/admin/products/[id]/edit/page.jsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Edit Product | Graphics2Prints',
  description: 'Edit an existing product',
};

export default async function EditProductPage({ params }) {
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

  const { id } = params;
  
  // Fetch the product
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Product: {product.name}</h1>
        <Link href="/admin/products" className="text-blue-500 hover:underline">
          &larr; Back to Products
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
