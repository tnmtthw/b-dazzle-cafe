import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  const description =
    "Step into B'Dazzle Cafe — where every sip sparkles and every bite delights. A cozy haven of bold flavors, dazzling vibes, and unforgettable moments. Come for the coffee, stay for the magic!";

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/img/bg-main.png"
          alt="Cafe Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center">
        <div className="py-20 md:py-32 max-w-2xl">
          {/* Decorative Element */}
          <div className="w-24 h-1 bg-yellow-primary mb-8"></div>
          
          {/* Heading */}
          <h1 className="font-playfair font-bold mb-6 text-left">
            <span className="block text-5xl md:text-6xl lg:text-7xl text-yellow-primary mb-2">Welcome to</span>
            <span className="block text-6xl md:text-7xl lg:text-8xl text-white mb-2">B'Dazzle</span>
            <span className="block text-5xl md:text-6xl lg:text-7xl text-yellow-primary">Cafe</span>
          </h1>
          
          {/* Description */}
          <p className="text-white text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
            {description}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-white text-brown-primary font-medium px-8 py-4 rounded-full hover:bg-gray-100 transition-colors duration-300 text-lg">
              Order Now
            </button>
            <Link href="/account/sign-up" passHref>
              <button className="bg-yellow-primary text-brown-primary font-medium px-8 py-4 rounded-full hover:bg-yellow-400 transition-colors duration-300 text-lg">
                Sign Up
              </button>
            </Link>
          </div>

          {/* Scroll Down Indicator */}
          <div className="hidden md:flex items-center mt-20 text-white opacity-80">
            <div className="w-8 h-px bg-white mr-4"></div>
            <span className="text-sm uppercase tracking-wider">Scroll Down</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;