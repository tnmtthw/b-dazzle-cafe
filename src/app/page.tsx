import React from 'react';
import Link from 'next/link';
import HeroSection from './home/HeroSection';
import AboutUs from './home/AboutUs';

const MainPage = () => {
  const description =
    "Step into B'Dazzle Cafe — where every sip sparkles and every bite delights. A cozy haven of bold flavors, dazzling vibes, and unforgettable moments. Come for the coffee, stay for the magic!";

  return (
    <div>
      <HeroSection />
      <AboutUs />
    </div>
  );
};

export default MainPage;