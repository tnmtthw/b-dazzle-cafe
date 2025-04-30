"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Navbar from '@/component/NavbarFixed';


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


const SignUpPage = () => {
    const router = useRouter();

    const handleSignUp = async (values: any, { setSubmitting, setErrors }: any) => {
        try {
            const res = await fetch('/api/auth/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrors({ email: data.error });
            } else {
                console.log("User registered", data);
                router.push('/account/sign-in');
            }
        } catch (err) {
            console.error("Sign-up error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[url('/img/bg-main.png')] h-screen bg-cover bg-center flex items-center justify-start select-none">
            <div className="h-[75%] w-[75%] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                    <div className="hidden lg:flex bg-[url('/img/bg-r-section.jpg')] bg-right bg-cover items-center justify-center rounded-tl-[120px] rounded-bl-lg">
                        <h1 className="text-9xl text-center">B’Dazzle Cafe</h1>
                    </div>
                    <div className="bg-brown-primary flex-block lg:rounded-br-[120px] lg:rounded-tr-lg p-6 lg:p-10 space-y-4 text-white overflow-auto hide-scrollbar">
                        <h2 className="font-bold text-4xl">Sign up</h2>
                        <p>Already have an account? <span onClick={() => router.push('/account/sign-in')} className="underline cursor-pointer">Log in now</span></p>

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
                            {({ }) => (
                                <Form className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="text-sm">Name</label>
                                        <Field
                                            name="name"
                                            type="text"
                                            placeholder="Name"
                                            className="bg-white text-black pl-2 w-full h-10 rounded-lg placeholder:text-[#4A5568]"
                                        />
                                        <ErrorMessage name="name" component="div" className="text-red-400 text-xs" />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="text-sm">Email</label>
                                        <Field
                                            name="email"
                                            type="email"
                                            placeholder="example@gmail.com"
                                            className="bg-white text-black pl-2 w-full h-10 rounded-lg placeholder:text-[#4A5568]"
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-400 text-xs" />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="text-sm">Password</label>
                                        <Field
                                            name="password"
                                            type="password"
                                            placeholder="@#*%"
                                            className="bg-white text-black pl-2 w-full h-10 rounded-lg placeholder:text-[#4A5568]"
                                        />
                                        <ErrorMessage name="password" component="div" className="text-red-400 text-xs" />
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="text-sm">Confirm Password</label>
                                        <Field
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="Confirm Password"
                                            className="bg-white text-black pl-2 w-full h-10 rounded-lg placeholder:text-[#4A5568]"
                                        />
                                        <ErrorMessage name="confirmPassword" component="div" className="text-red-400 text-xs" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Field
                                                name="remember"
                                                type="checkbox"
                                                className="w-3 h-3 rounded-lg text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="remember" className="text-sm ms-2">Remember Me</label>
                                        </div>
                                        <div>
                                            <span className="underline text-sm cursor-pointer">Forgot Password?</span>
                                        </div>
                                    </div>

                                    <button type="submit" className="bg-white font-bold text-brown-primary w-full h-12 rounded-lg">
                                        Sign Up
                                    </button>
                                </Form>
                            )}
                        </Formik>

                        <div className="flex items-center justify-center my-4">
                            <div className="flex-grow border-t"></div>
                            <span className="mx-4 text-sm text-gray-200">OR</span>
                            <div className="flex-grow border-t"></div>
                        </div>

                        <button className="relative w-full h-12 border border-white rounded-full text-white mb-4">
                            <img src="/img/icon/google.svg" alt="Google" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                            <span className="block text-sm text-center w-full">Continue with Google</span>
                        </button>

                        <button className="relative w-full h-12 border border-white rounded-full text-white">
                            <img src="/img/icon/facebook.svg" alt="Facebook" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                            <span className="block text-sm text-center w-full">Continue with Facebook</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
