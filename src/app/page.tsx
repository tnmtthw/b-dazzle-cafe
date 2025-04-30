import React from 'react';

const MainPage = () => {
  const description =
    "Step into B'Dazzle Cafe — where every sip sparkles and every bite delights. A cozy haven of bold flavors, dazzling vibes, and unforgettable moments. Come for the coffee, stay for the magic!";

  return (
    <div className="bg-[url('/img/bg-main.png')] h-screen bg-cover bg-center flex items-center justify-start px-10">
      <div>
        <div className="select-none">
          <h1 className="text-4xl font-bold mb-4 flex flex-col">
            <span className="text-yellow-primary">Welcome</span>
            <span>B'Dazzle</span>
            <span className="text-yellow-primary">Cafe</span>
          </h1>
          <p className="text-lg max-w-xl mb-6">{description}</p>
        </div>
        <div className="flex space-x-4">
          <button className="bg-white p-4 text-black rounded-full min-w-32 cursor-pointer select-none">
            Order Now
          </button>
          <button className="bg-yellow-primary p-4 text-black rounded-full min-w-32 cursor-pointer select-none">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
