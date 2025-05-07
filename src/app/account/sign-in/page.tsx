"use client";

import React, { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Eye, EyeOff } from 'lucide-react';
import * as Yup from "yup";

const SignInPage = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const validationSchema = Yup.object({
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
    });

    async function handleSignIn(values: any) {
        const response = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        console.log(response)

        if (response?.error === "Configuration") {
            setErrorMessage("Your account is not verified. Please check your email to verify your account.");
        } else if (response?.error === "CredentialsSignin") {
            setErrorMessage("Invalid email or password. Please try again.");
        } else {
            router.replace("/admin");
        }
    }

    return (
        <div className="bg-[url('/img/bg-main.png')] min-h-screen bg-cover bg-center flex items-center justify-center py-12">
            <div className="w-full max-w-4xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl">
                    {/* Left side - Image (hidden on mobile) */}
                    <div className="hidden lg:flex bg-[url('/img/bg-r-section.jpg')] bg-right bg-cover items-center justify-center rounded-tl-[70px] rounded-bl-xl">
                        <h1 className="text-5xl md:text-6xl text-center font-bold drop-shadow-md text-white">B'Dazzle Cafe</h1>
                    </div>

                    {/* Right side - Form */}
                    <div className="bg-brown-primary lg:rounded-tr-[70px] lg:rounded-br-[70px] p-6 lg:p-7 space-y-3 text-white">
                        <h2 className="font-bold text-2xl mb-1">Sign in</h2>
                        <p className="text-sm mb-3">Don't have an account? <span onClick={() => router.push('/account/sign-up')} className="underline cursor-pointer font-medium text-yellow-primary hover:text-yellow-300 transition-colors">Create now</span></p>

                        {errorMessage && (
                            <div className="text-red-300 text-xs mb-3 p-3 bg-red-900 bg-opacity-20 rounded-lg border border-red-800">
                                {errorMessage}
                            </div>
                        )}

                        <Formik
                            initialValues={{
                                email: "",
                                password: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSignIn}
                        >
                            {({ isSubmitting }) => (
                                <Form className="space-y-3">
                                    <div className="group">
                                        <label htmlFor="email" className="text-xs block mb-1 font-medium">Email</label>
                                        <Field
                                            name="email"
                                            type="email"
                                            placeholder="example@gmail.com"
                                            className="bg-white bg-opacity-90 text-black px-3 w-full h-10 rounded-lg placeholder:text-gray-500 text-sm focus:ring-2 focus:ring-yellow-primary focus:outline-none transition-all"
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
                                                className="bg-white bg-opacity-90 text-black px-3 w-full h-10 rounded-lg placeholder:text-gray-500 text-sm focus:ring-2 focus:ring-yellow-primary focus:outline-none transition-all"
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

                                    <div className="flex items-center justify-between text-xs pt-1">
                                        <div className="flex items-center">
                                            <Field
                                                name="remember"
                                                type="checkbox"
                                                className="w-3 h-3 rounded-sm text-yellow-primary focus:ring-1 focus:ring-yellow-primary"
                                            />
                                            <label htmlFor="remember" className="ms-2 text-gray-200">Remember Me</label>
                                        </div>
                                        <div>
                                            <span className="underline cursor-pointer text-gray-200 hover:text-white transition-colors">Forgot Password?</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-yellow-primary font-bold text-brown-primary w-full h-10 rounded-lg hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-all text-sm mt-2"
                                    >
                                        {isSubmitting ? "Signing in..." : "Sign In"}
                                    </button>
                                </Form>
                            )}
                        </Formik>

                        <div className="flex items-center justify-center my-2 relative z-10">
                            <div className="flex-grow border-t border-gray-400 opacity-50"></div>
                            <span className="mx-3 text-xs text-gray-200">OR</span>
                            <div className="flex-grow border-t border-gray-400 opacity-50"></div>
                        </div>

                        <button className="relative w-full h-10 border border-white rounded-lg text-white mb-2 hover:bg-white hover:bg-opacity-10 focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all text-sm z-10">
                            <img src="/img/icon/google.svg" alt="Google" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                            <span className="block text-center w-full">Continue with Google</span>
                        </button>

                        <button className="relative w-full h-10 border border-white rounded-lg text-white hover:bg-white hover:bg-opacity-10 focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all text-sm z-10">
                            <img src="/img/icon/facebook.svg" alt="Facebook" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                            <span className="block text-center w-full">Continue with Facebook</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;