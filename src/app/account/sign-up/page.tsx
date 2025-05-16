"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Eye, EyeOff } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from "yup";
import Link from 'next/link';

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
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

const inputStyles = "font-nunito bg-white bg-opacity-95 text-black px-4 w-full h-11 rounded-lg placeholder:text-gray-500 text-sm font-medium focus:ring-2 focus:ring-yellow-primary focus:outline-none transition-all tracking-wide";

const SignUpPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignUp = async (values: any, { setSubmitting, setErrors }: any) => {
        try {
            // Show loading toast
            const loadingToast = toast.loading("Creating your account...");

            const res = await fetch('/api/auth/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            // Dismiss loading toast
            toast.dismiss(loadingToast);

            if (!res.ok) {
                // Show error toast
                toast.error(data.error || "Failed to create account");
                setErrors({ email: data.error });
            } else {
                // Show success toast
                toast.success("Account created successfully! Check your email for verification.");
                console.log("User registered", data);

                // Redirect after a short delay
                setTimeout(() => {
                    router.push('/account/sign-in');
                }, 1500);
            }
        } catch (err) {
            console.error("Sign-up error:", err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
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

            <div className="w-full max-w-4xl mx-auto px-8 pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl">
                    {/* Left side - Image (hidden on mobile) */}
                    <div className="hidden lg:flex bg-[url('/img/bg-r-section.jpg')] bg-right bg-cover items-center justify-center rounded-tl-[70px] rounded-bl-xl">
                        <h1 className="font-playfair text-6xl md:text-7xl text-center font-bold drop-shadow-md text-white flex flex-col leading-tight">
                            <span>B'Dazzle</span>
                            <span>Cafe</span>
                        </h1>
                    </div>

                    {/* Right side - Form */}
                    <div className="bg-brown-primary lg:rounded-tr-[70px] lg:rounded-br-xl p-6 lg:p-8 space-y-3 text-white">
                        <h2 className="font-bold text-2xl mb-1">Sign up</h2>
                        <p className="text-sm mb-3">Already have an account? <span onClick={() => router.push('/account/sign-in')} className="underline cursor-pointer font-medium text-yellow-primary hover:text-yellow-300 transition-colors">Log in now</span></p>

                        <Formik
                            initialValues={{
                                name: "",
                                email: "",
                                password: "",
                                confirmPassword: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values, actions) => handleSignUp(values, actions)}
                        >
                            {({ isSubmitting }) => (
                                <Form className="space-y-4">
                                    <div className="group">
                                        <label htmlFor="name" className="text-xs block mb-1 font-medium">Name</label>
                                        <Field
                                            name="name"
                                            type="text"
                                            placeholder="Name"
                                            className={inputStyles}
                                        />
                                        <ErrorMessage name="name" component="div" className="text-red-300 text-xs mt-1" />
                                    </div>

                                    <div className="group">
                                        <label htmlFor="email" className="text-xs block mb-1 font-medium">Email</label>
                                        <Field
                                            name="email"
                                            type="email"
                                            placeholder="example@gmail.com"
                                            className={inputStyles}
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-300 text-xs mt-1" />
                                    </div>

                                    <div className="group">
                                        <label htmlFor="password" className="text-xs block mb-1 font-medium">Password</label>
                                        <div className="relative">
                                            <Field
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="@#*%"
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
                                                placeholder="Confirm Password"
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

                                    <div className="flex items-center justify-between text-xs pt-1">
                                        <div className="flex items-center">
                                            <Field
                                                name="remember"
                                                type="checkbox"
                                                className="w-3 h-3 rounded-sm text-yellow-primary focus:ring-1 focus:ring-yellow-primary"
                                            />
                                            <label htmlFor="remember" className="ms-2 text-gray-200 font-nunito">Remember Me</label>
                                        </div>
                                        <div>
                                            <Link
                                                href="/account/forgot-password"
                                                className="underline cursor-pointer text-gray-200 hover:text-white transition-colors font-nunito"
                                            >
                                                Forgot Password?
                                            </Link>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-yellow-primary font-bold text-brown-primary w-full h-11 rounded-lg hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-all text-sm mt-2 font-nunito"
                                    >
                                        {isSubmitting ? "Signing up..." : "Sign Up"}
                                    </button>
                                </Form>
                            )}
                        </Formik>

                        <div className="flex items-center justify-center my-2 relative z-10">
                            <div className="flex-grow border-t border-gray-400 opacity-50"></div>
                            <span className="mx-3 text-xs text-gray-200 font-nunito">OR</span>
                            <div className="flex-grow border-t border-gray-400 opacity-50"></div>
                        </div>

                        <button className="font-nunito relative w-full h-11 border border-white rounded-lg text-white mb-2 hover:bg-white hover:text-brown-primary transition-all focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm z-10">
                            <img src="/img/icon/google.svg" alt="Google" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                            <span className="block text-center w-full">Continue with Google</span>
                        </button>

                        <button className="font-nunito relative w-full h-11 border border-white rounded-lg text-white hover:bg-white hover:text-brown-primary transition-all focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm z-10">
                            <img src="/img/icon/facebook.svg" alt="Facebook" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                            <span className="block text-center w-full">Continue with Facebook</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;