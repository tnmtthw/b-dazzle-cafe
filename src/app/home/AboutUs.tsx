import React from 'react';

const AboutUs = () => {
    return (
        <div className="bg-[url('/img/bg-aboutus.png')] h-screen bg-cover bg-center px-10">
            <div className="flex items-start my-4 w-full">
                <span className="mx-4 text-sm text-black">About Us</span>
                <div className="flex-grow border-t border-black mt-2"></div>
            </div>
            <div className="grid grid-cols-2">
                <div className="text-black">
                    <p>Lorem ipsum dolor sit amet consectetur. Scelerisque urna vel sit dolor fringilla volutpat lectus amet. Integer sed pretium odio lectus at malesuada sed eget nunc. Viverra malesuada viverra id vel tortor dui adipiscing.</p>
                    <p>Lorem ipsum dolor sit amet consectetur. Scelerisque urna vel sit dolor fringilla volutpat lectus amet. Integer sed pretium odio lectus at malesuada sed eget nunc. Viverra malesuada viverra id vel tortor dui adipiscing.</p>
                </div>
                <div className="h-[60%] w-[60%]">
                    <img className="object-contain h-52 w-52" src="/img/aboutus.jpg" />
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
