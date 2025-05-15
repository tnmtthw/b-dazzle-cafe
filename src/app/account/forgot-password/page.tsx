'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ArrowLeft, Mail, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from "yup";
import Link from 'next/link';

const inputStyles = "font-nunito bg-white bg-opacity-95 text-black px-4 w-full h-11 rounded-lg placeholder:text-gray-500 text-sm font-medium focus:ring-2 focus:ring-yellow-primary focus:outline-none transition-all tracking-wide";

// Define the steps in the password reset flow
enum ResetStep {
  REQUEST_RESET = 'request',
  EMAIL_SENT = 'email-sent',
  RESET_PASSWORD = 'reset',
  SUCCESS = 'success'
}

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [resetStep, setResetStep] = useState<ResetStep>(ResetStep.REQUEST_RESET);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email validation schema
  const emailValidationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  // Password reset validation schema
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

  // Handle the initial request to reset password
  const handleRequestReset = async (values: { email: string }) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Processing your request...");
      
      // Call our API to send the reset email
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email
        }),
      });
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send reset email');
      }
      
      // Show success toast
      toast.success("Reset link sent to your email");
      
      // Save email for potential use in other steps
      setEmail(values.email);
      
      // Move to the next step
      setResetStep(ResetStep.EMAIL_SENT);
      
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Handle the password reset submission
  const handleResetPassword = async (values: { password: string; confirmPassword: string }) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Updating your password...");
      
      // For frontend-only demo, we'll simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show success toast
      toast.success("Password updated successfully");
      
      // Move to the success step
      setResetStep(ResetStep.SUCCESS);
      
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // For demo purposes, to show the reset password screen without actually sending an email
  const handleMockResetLink = () => {
    setResetStep(ResetStep.RESET_PASSWORD);
  };

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (resetStep) {
      case ResetStep.REQUEST_RESET:
        return (
          <Formik
            initialValues={{ email: "" }}
            validationSchema={emailValidationSchema}
            onSubmit={handleRequestReset}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="group">
                  <label htmlFor="email" className="text-xs block text-white mb-1 font-medium">Email Address</label>
                  <div className="relative">
                    <Field
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      className={inputStyles}
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-red-300 text-xs mt-1" />
                </div>

                <p className="text-white/80 text-sm">
                  We'll send a password reset link to your email address.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-yellow-primary font-bold text-brown-primary w-full h-11 rounded-lg hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-all text-sm mt-2 font-nunito"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/account/sign-in')}
                  className="bg-transparent border border-white/30 text-white w-full h-11 rounded-lg hover:bg-white/10 focus:ring-2 focus:ring-white focus:ring-opacity-30 transition-all text-sm font-nunito flex items-center justify-center"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Sign In
                </button>
              </Form>
            )}
          </Formik>
        );

      case ResetStep.EMAIL_SENT:
        return (
          <div className="text-center">
            <div className="inline-block p-4 bg-yellow-primary/20 rounded-full mb-4">
              <Mail className="h-8 w-8 text-yellow-primary" />
            </div>
            
            <h3 className="text-white text-lg font-bold mb-3">Check your email</h3>
            
            <p className="text-white/80 text-sm mb-6">
              We've sent a password reset link to <span className="text-white font-medium">{email}</span>. 
              Please check your inbox and follow the link to reset your password.
            </p>
            
            <p className="text-yellow-primary text-sm mb-8">
              The link will expire in 30 minutes.
            </p>
            
            {/* For demo purposes only - allows us to view the password reset screen */}
            <button
              onClick={handleMockResetLink}
              className="text-white/60 text-sm underline hover:text-white mb-6 font-nunito"
            >
              (Demo: Click here to simulate clicking the email link)
            </button>
            
            <button
              onClick={() => setResetStep(ResetStep.REQUEST_RESET)}
              className="bg-transparent border border-white/30 text-white w-full h-11 rounded-lg hover:bg-white/10 focus:ring-2 focus:ring-white focus:ring-opacity-30 transition-all text-sm font-nunito mb-3"
            >
              Use a different email
            </button>
            
            <button
              onClick={() => router.push('/account/sign-in')}
              className="bg-transparent text-white/70 hover:text-white text-sm transition-colors font-nunito"
            >
              Back to Sign In
            </button>
          </div>
        );

      case ResetStep.RESET_PASSWORD:
        return (
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={passwordValidationSchema}
            onSubmit={handleResetPassword}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="group">
                  <label htmlFor="password" className="text-xs block mb-1 font-medium">New Password</label>
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
                  <label htmlFor="confirmPassword" className="text-xs block mb-1 font-medium">Confirm Password</label>
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
              </Form>
            )}
          </Formik>
        );

      case ResetStep.SUCCESS:
        return (
          <div className="text-center">
            <div className="inline-block p-4 bg-green-500/20 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            
            <h3 className="text-white text-lg font-bold mb-3">Password Reset Complete</h3>
            
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
        );
    }
  };

  return (
    <div className="bg-[url('/img/bg-main.png')] min-h-screen bg-cover bg-center flex items-center justify-center py-12">
      {/* Toast notification container */}
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
            {/* Logo/Branding */}
            <div className="flex justify-center mb-6">
              <img src="/img/logo.png" alt="B'Dazzle Cafe" className="h-12 w-auto" />
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              {resetStep === ResetStep.REQUEST_RESET && "Forgot Password"}
              {resetStep === ResetStep.EMAIL_SENT && "Check Your Email"}
              {resetStep === ResetStep.RESET_PASSWORD && "Reset Your Password"}
              {resetStep === ResetStep.SUCCESS && "Success!"}
            </h2>
            
            {/* Dynamic content based on step */}
            {renderStepContent()}
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

export default ForgotPasswordPage;