import React from 'react';
import Image from 'next/image';

const AboutUs = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background Image with overlay */}
            <div className="absolute inset-0">
                <Image
                    src="/img/bg-aboutus.png"
                    alt="About Us Background"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
                {/* Section Header */}
                <div className="mb-12">
                    <h2 className="font-playfair font-bold text-5xl md:text-6xl lg:text-7xl text-black mb-2">
                        <span className="text-white">About</span> Us
                    </h2>
                    <div className="w-24 h-1 bg-brown-primary mt-6"></div>
                </div>
                
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Left Column - Text */}
                    <div className="text-black space-y-6">
                        <p className="leading-relaxed text-lg">
                            B'Dazzle Cafe was born from a passion for exceptional coffee and a desire to create a space where people could connect, relax, and enjoy moments of pure delight.
                        </p>
                        <p className="leading-relaxed text-lg">
                            Founded in 2020, our cafe has quickly become a beloved fixture in the community, known for our carefully sourced beans, skilled baristas, and warm, inviting atmosphere.
                        </p>
                        <p className="leading-relaxed text-lg">
                            We believe that a great cup of coffee has the power to transform your day, and we're committed to crafting each beverage with precision, care, and a touch of artistry.
                        </p>
                        <button className="mt-8 bg-brown-primary hover:bg-brown-primary-hover text-white py-4 px-10 rounded-tr-[30px] rounded-bl-[30px] flex items-center justify-between w-48 transition-colors">
                            <span className="font-playfair text-lg">Read More</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-45">
                                <path d="M5 12h14"></path>
                                <path d="M12 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                    
                    {/* Right Column - Image */}
                    <div className="flex justify-center">
                        <div className="relative h-[500px] w-full max-w-md overflow-hidden rounded-tr-[40px] rounded-bl-[40px] shadow-xl">
                            <Image 
                                src="/img/aboutus.jpg" 
                                alt="B'Dazzle Cafe food display"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Values Section (Optional) */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-md">
                        <h3 className="font-playfair text-2xl font-bold text-brown-primary mb-4">Our Mission</h3>
                        <p className="text-gray-800">To create an unforgettable coffee experience that brings joy and connection to our community, one cup at a time.</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-md">
                        <h3 className="font-playfair text-2xl font-bold text-brown-primary mb-4">Our Vision</h3>
                        <p className="text-gray-800">To be recognized as the premier destination for coffee lovers, known for our exceptional quality and genuine hospitality.</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-md">
                        <h3 className="font-playfair text-2xl font-bold text-brown-primary mb-4">Our Values</h3>
                        <p className="text-gray-800">Quality, community, sustainability, and creativity guide everything we do at B'Dazzle Cafe.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;