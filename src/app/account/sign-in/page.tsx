import React from 'react';

const SignInPage = () => {
    return (
        <div className="bg-[url('/img/bg-main.png')] h-screen bg-cover bg-center flex items-center justify-start px-10 select-none">
            <div className=" h-[75%] w-[75%] mx-auto">
                <div className="grid grid-cols-2 h-full">
                    <div className="bg-[url('/img/bg-r-section.jpg')] bg-right bg-cover flex items-center justify-center rounded-tl-[120px] rounded-bl-lg">
                        <h1 className="text-9xl text-center">B’Dazzle Cafe</h1>
                    </div>
                    <div className="bg-brown-primary flex-block rounded-br-[120px] rounded-tr-lg p-20 space-y-4">
                        <h2 className="font-bold text-4xl">Sign in</h2>
                        <p>Don't have an account? <span className="underline">Create now</span></p>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="email" className="text-sm">Email</label>
                                <input type="email" id="email" className="bg-white text-black pl-2 w-full h-10 rounded-lg placeholder:text-[#4A5568]" placeholder="example@gmail.com" required />
                            </div>
                            <div>
                                <label htmlFor="password" className="text-sm">Password</label>
                                <input type="password" id="password" className="bg-white text-black pl-2 w-full h-10 rounded-lg placeholder:text-[#4A5568]" placeholder="@#*%" required />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <input id="default-checkbox" type="checkbox" value="" className="w-3 h-3 rounded-lg text-blue-600  focus:ring-blue-500" />
                                    <label htmlFor="default-checkbox" className="text-sm ms-2">Remember Me</label>
                                </div>
                                <div>
                                    <span className="underline text-sm">Forgot Password?</span>
                                </div>
                            </div>
                            <button type="submit" className="bg-white font-bold text-brown-primary w-full h-12 rounded-lg">Sign in</button>
                        </form>
                        <div className="flex items-center justify-center my-4">
                            <div className="flex-grow border-t"></div>
                            <span className="mx-4 text-sm text-gray-200">OR</span>
                            <div className="flex-grow border-t"></div>
                        </div>
                        <button className="relative w-full h-12 border border-white rounded-full text-white mb-4">
                            <img src="/img/icon/google.svg" alt="Google" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                            <span className="block text-sm text-center w-full">Continue with Google</span>
                        </button>

                        <button className="relative w-full h-12 border border-white rounded-full text-white ">
                            <img src="/img/icon/facebook.svg" alt="Facebook" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                            <span className="block text-sm text-center w-full">Continue with Facebook</span>
                        </button>
                    </div>
                </div >
            </div >
        </div >
    );
};

export default SignInPage;