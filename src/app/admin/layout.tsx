'use client';

import React, { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminMainNav from './components/AdminMainNav';
import { EspressoSpinner } from '@/components';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <AdminMainNav>{children}</AdminMainNav>;
}