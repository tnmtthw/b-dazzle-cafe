'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import AdminDashboard from '@/app/admin/components/AdminDashboard';

const DashboardPage = () => {
  const { data: session, status } = useSession();

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-primary"></div>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default DashboardPage;