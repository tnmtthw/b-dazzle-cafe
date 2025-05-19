'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProductTable from '@/app/admin/components/ProductTable';
import { EspressoSpinner } from '@/components';

export default function ProductControlPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EspressoSpinner size="lg" />
      </div>
    );
  }

  // Check if user is authorized (has Admin role)
  if (!session || session.user?.role !== "Admin") {
    // Redirect to home page or unauthorized page
    router.push('/');
    return null;
  }

  return <ProductTable />;
}