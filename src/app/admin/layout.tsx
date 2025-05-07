"use client";

import React, { ReactNode } from 'react';
import AdminLayout from './components/AdminLayout';

interface AdminLayoutWrapperProps {
  children: ReactNode;
}

// This layout component wraps all admin pages with the AdminLayout
export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  return <AdminLayout>{children}</AdminLayout>;
}