import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  const description =
    "Step into B'Dazzle Cafe — where every sip sparkles and every bite delights. A cozy haven of bold flavors, dazzling vibes, and unforgettable moments. Come for the coffee, stay for the magic!";

  return (
    <div className="relative min-h-[700px] md:min-h-[800px] lg:min-h-[1000px] bg-cover ">
      {/* Background Image */}
      <Image
        src="/img/bg-main.png"
        alt="Background"
        fill
        className=" z-[-1]"
        priority
      />
      <div className="content flex pl-32 items-center justify-start px-10 py-20">
        <div className="select-none">
          <h1 className="font-playfair text-8xl font-bold mb-4 flex flex-col">
            <span className="text-yellow-primary">Welcome</span>
            <span className='text-white'>B'Dazzle</span>
            <span className="text-yellow-primary">Cafe</span>
          </h1>
          <p className="text-lg max-w-xl mb-6 text-white">{description}</p>

          <div className="flex space-x-4">
            <button className="bg-white p-4 text-black rounded-full min-w-32 cursor-pointer select-none">
              Order Now
            </button>
            <Link href="/account/sign-up" passHref>
              <button className="bg-yellow-primary p-4 text-black rounded-full min-w-32 cursor-pointer select-none">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
