"use client";

import React from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import router from 'next/router';

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


const SignInPage = () => {
    async function handleSignIn(values: any) {
        const response = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        if (response?.error) {
            console.log("Invalid email or password");
        } else {
            router.replace("");
        }
    }

    const router = useRouter();
    return (
        <div className="bg-[url('/img/bg-main.png')] h-screen bg-cover bg-center flex items-center justify-start select-none">
            <div className="h-[75%] w-[75%] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                    <div className="hidden lg:flex bg-[url('/img/bg-r-section.jpg')] bg-right bg-cover items-center justify-center rounded-tl-[120px] rounded-bl-lg">
                        <h1 className="text-9xl text-center">B’Dazzle Cafe</h1>
                    </div>
                    <div className="bg-brown-primary flex-block lg:rounded-br-[120px] lg:rounded-tr-lg p-6 lg:p-10 space-y-4 text-white overflow-auto hide-scrollbar" >
                        <h2 className="font-bold text-4xl">Sign in</h2>
                        <p>Don't have an account? <span onClick={() => router.push('/account/sign-up')} className="underline cursor-pointer">Create now</span></p>

                        <Formik
                            initialValues={{
                                username: "",
                                email: "john@example.com",
                                password: "Password123!",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSignIn}
                        >
                            {({ }) => (
                                <Form className="space-y-4">
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
                                        Sign In
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

export default SignInPage;
