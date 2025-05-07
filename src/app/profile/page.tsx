"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, Mail, ShieldCheck, LogOut, Coffee, Package, Edit } from "lucide-react";
import Link from "next/link";
import EspressoSpinner from "@/component/EspressoSpinner";
import { Nunito } from 'next/font/google';

// Initialize Nunito font
const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
});

const UserProfile = () => {
  const { data: session, status } = useSession();
  const [navbarHeight, setNavbarHeight] = useState(72); // Default value

  // Effect to measure navbar height
  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.querySelector('header');
      if (navbar) {
        setNavbarHeight(navbar.clientHeight);
      }
    };
    
    // Update on initial render
    updateNavbarHeight();
    
    // Update on window resize
    window.addEventListener('resize', updateNavbarHeight);
    
    return () => {
      window.removeEventListener('resize', updateNavbarHeight);
    };
  }, []);

  if (status === "loading") {
    return (
      <div className={`${nunito.className} flex items-center justify-center min-h-screen`}>
        <EspressoSpinner />
      </div>
    );
  }

  if (!session) {
    return (
      <div className={`${nunito.className} flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4`}>
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">You are not logged in</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your profile</p>
          <Link 
            href="/account/sign-in"
            className="inline-block bg-brown-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-brown-primary-hover transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    signOut({});
  };

  return (
    <div 
      className={`${nunito.className} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50`}
      style={{ paddingTop: `${navbarHeight + 24}px` }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="bg-brown-primary h-32 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="bg-white rounded-full p-2 shadow-md w-24 h-24 flex items-center justify-center">
                <div className="bg-yellow-primary rounded-full w-20 h-20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-brown-primary">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-6 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {session.user?.name || session.user?.email}
                </h1>
                <p className="text-gray-500 flex items-center mt-1">
                  <ShieldCheck className="h-4 w-4 mr-1 text-brown-primary" />
                  {session.user?.role}
                </p>
              </div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center text-red-500 hover:text-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* User Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-yellow-50 rounded-full p-2 mr-4 flex-shrink-0">
                <User className="h-5 w-5 text-brown-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-medium text-gray-900">{session.user?.id}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-yellow-50 rounded-full p-2 mr-4 flex-shrink-0">
                <Mail className="h-5 w-5 text-brown-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">{session.user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-yellow-50 rounded-full p-2 mr-4 flex-shrink-0">
                <ShieldCheck className="h-5 w-5 text-brown-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Role</p>
                <p className="font-medium text-gray-900">{session.user?.role}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="flex items-center text-brown-primary hover:text-brown-primary-hover transition-colors">
              <Edit className="h-4 w-4 mr-1" />
              <span className="font-medium">Edit Profile</span>
            </button>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link href="/profile/orders" className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow flex items-center">
            <div className="bg-yellow-50 rounded-full p-3 mr-4">
              <Package className="h-6 w-6 text-brown-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">My Orders</h3>
              <p className="text-sm text-gray-500">View your order history</p>
            </div>
          </Link>
          
          <Link href="/products" className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow flex items-center">
            <div className="bg-yellow-50 rounded-full p-3 mr-4">
              <Coffee className="h-6 w-6 text-brown-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Browse Products</h3>
              <p className="text-sm text-gray-500">Discover our coffee selection</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;