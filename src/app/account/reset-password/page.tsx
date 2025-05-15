'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from "yup";
import Link from 'next/link';

const inputStyles = "font-nunito bg-white bg-opacity-95 text-black px-4 w-full h-11 rounded-lg placeholder:text-gray-500 text-sm font-medium focus:ring-2 focus:ring-yellow-primary focus:outline-none transition-all tracking-wide";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);

  // Extract token and email from URL on page load
  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setIsInvalid(true);
      toast.error("Invalid or missing reset token");
    } else {
      setToken(token);
      setEmail(email);
    }
  }, [searchParams]);

  // Password validation schema
  const passwordValidationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must not exceed 20 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // Handle the password reset submission
  const handleResetPassword = async (values: { password: string; confirmPassword: string }) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Updating your password...");
      
      // Call the reset password API
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password: values.password
        }),
      });
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset password');
      }
      
      // Show success toast
      toast.success("Password updated successfully");
      
      // Set success state
      setIsSuccess(true);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  // If token is invalid, show error message
  if (isInvalid) {
    return (
      <div className="bg-[url('/img/bg-main.png')] min-h-screen bg-cover bg-center flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-8 pt-6">
          <div className="bg-brown-primary rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <img src="/img/logo.png" alt="B'Dazzle Cafe" className="h-12 w-auto" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-6">Invalid Reset Link</h2>
              
              <p className="text-white/80 text-sm mb-8">
                The password reset link is invalid or expired. Please request a new password reset link.
              </p>
              
              <Link 
                href="/account/forgot-password"
                className="bg-yellow-primary font-bold text-brown-primary w-full h-11 rounded-lg hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-all text-sm font-nunito inline-flex items-center justify-center"
              >
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success view
  if (isSuccess) {
    return (
      <div className="bg-[url('/img/bg-main.png')] min-h-screen bg-cover bg-center flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-8 pt-6">
          <div className="bg-brown-primary rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <img src="/img/logo.png" alt="B'Dazzle Cafe" className="h-12 w-auto" />
              </div>
              
              <div className="inline-block p-4 bg-green-500/20 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">Password Reset Complete</h2>
              
              <p className="text-white/80 text-sm mb-8">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              
              <button
                onClick={() => router.push('/account/sign-in')}
                className="bg-yellow-primary font-bold text-brown-primary w-full h-11 rounded-lg hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-all text-sm font-nunito"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="bg-[url('/img/bg-main.png')] min-h-screen bg-cover bg-center flex items-center justify-center py-12">
      <Toaster position="bottom-right" toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        }
      }} />
      
      <div className="w-full max-w-md mx-auto px-8 pt-6">
        <div className="bg-brown-primary rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <img src="/img/logo.png" alt="B'Dazzle Cafe" className="h-12 w-auto" />
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center mb-6">Reset Your Password</h2>
            
            <Formik
              initialValues={{ password: "", confirmPassword: "" }}
              validationSchema={passwordValidationSchema}
              onSubmit={handleResetPassword}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="group">
                    <label htmlFor="password" className="text-xs block mb-1 font-medium text-white">New Password</label>
                    <div className="relative">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className={inputStyles}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ?
                          <EyeOff size={16} className="text-gray-600" /> :
                          <Eye size={16} className="text-gray-600" />
                        }
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-300 text-xs mt-1" />
                  </div>

                  <div className="group">
                    <label htmlFor="confirmPassword" className="text-xs block mb-1 font-medium text-white">Confirm Password</label>
                    <div className="relative">
                      <Field
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className={inputStyles}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ?
                          <EyeOff size={16} className="text-gray-600" /> :
                          <Eye size={16} className="text-gray-600" />
                        }
                      </button>
                    </div>
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-300 text-xs mt-1" />
                  </div>

                  <div className="bg-white/10 p-3 rounded-lg text-sm text-white/80">
                    <p className="mb-2 font-medium text-white">Password requirements:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>At least 8 characters</li>
                      <li>At least one uppercase letter (A-Z)</li>
                      <li>At least one lowercase letter (a-z)</li>
                      <li>At least one number (0-9)</li>
                      <li>At least one special character (@$!%*?&#)</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-yellow-primary font-bold text-brown-primary w-full h-11 rounded-lg hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-all text-sm mt-2 font-nunito"
                  >
                    {isSubmitting ? "Updating..." : "Reset Password"}
                  </button>

                  <div className="text-center">
                    <Link 
                      href="/account/sign-in" 
                      className="text-white/70 hover:text-white text-sm transition-colors font-nunito"
                    >
                      Cancel and return to sign in
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        
        <div className="text-center mt-6 text-white/60 text-sm">
          <p>
            Need help? <Link href="/contact" className="text-yellow-primary hover:text-yellow-300">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;