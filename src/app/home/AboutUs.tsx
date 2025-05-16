import React from 'react';

const AboutUs = () => {
    return (
        <div className="bg-[url('/img/bg-aboutus.png')] min-h-screen bg-cover bg-center py-16 px-8 md:px-16 lg:px-24">
            {/* Section with content */}
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="mb-12">
                    <h2 className="text-4xl font-playfair font-bold text-black mb-2">About Us</h2>
                    <div className="w-full border-t border-gray-400"></div>
                </div>
                
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Left Column - Text */}
                    <div className="text-black space-y-6">
                        <p className="leading-relaxed">
                            Welcome to B'Dazzle Cafe, where every cup tells a story. Established with a passion for exceptional coffee and authentic flavors, we've created a warm, inviting space where community and quality come together. Our skilled baristas craft each beverage with precision and care, using ethically sourced beans from renowned coffee regions around the world.
                        </p>
                        <p className="leading-relaxed">
                            Beyond our signature espresso drinks and specialty coffees, we take pride in our delicious menu of freshly prepared food items. From hearty breakfast options to satisfying lunch meals and tempting pastries, we ensure each dish complements the coffee experience perfectly. At B'Dazzle Cafe, we believe in creating moments of joy and connection, one perfectly brewed cup at a time.
                        </p>
                        <button className="mt-8 bg-brown-primary hover:bg-brown-primary-hover text-white py-3 px-10  flex rounded-tr-[30]   rounded-bl-[30] items-center justify-between w-48 transition-colors">
                            <span className="font-playfair text-lg">Read More</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-45">
                                <path d="M5 12h14"></path>
                                <path d="M12 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                    
                    {/* Right Column - Image */}
                    <div className="flex justify-center">
                        <img 
                            className="w-full h-auto object-cover max-w-md rounded" 
                            src="/img/aboutus.jpg" 
                            alt="B'Dazzle Cafe food display"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;