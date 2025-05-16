import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, ExternalLink, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full">
            {/* Location Section */}
            <div className="bg-white w-full py-16">
                <div className="max-w-6xl mx-auto px-8">
                    {/* Section Header */}
                    <div className="mb-10">
                        <h2 className="text-4xl font-playfair font-bold text-black mb-3">Visit Our Café</h2>
                        <div className="w-24 h-1 bg-yellow-primary"></div>
                    </div>
                </div>
                
                {/* Full width background with constrained content */}
                <div className="bg-[#262626] w-full">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            {/* Address */}
                            <div className="text-white p-8 md:p-12">
                                <div className="mb-8">
                                    <div className="flex items-start mb-6">
                                        <MapPin className="text-yellow-primary mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-xl font-bold mb-3">Our Location</h3>
                                            <p className="text-xl mb-1 leading-relaxed">Nautical Highway, Cor Lusterio</p>
                                            <p className="text-xl mb-1 leading-relaxed">St, Bansud, 5210 Oriental</p>
                                            <p className="text-xl mb-4 leading-relaxed">Mindoro</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 items-center">
                                        <div className="w-3 h-8 bg-yellow-primary rounded-full"></div>
                                        <div className="w-3 h-8 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                
                                <Link 
                                    href="https://maps.google.com" 
                                    target="_blank" 
                                    className="inline-flex items-center bg-yellow-primary text-brown-primary py-3 px-6 rounded-lg font-medium hover:bg-yellow-400 transition-colors shadow-lg"
                                >
                                    <span className="mr-2">Get Directions</span>
                                    <ExternalLink size={16} />
                                </Link>
                            </div>
                            
                            {/* Map */}
                            <div className="rounded-lg overflow-hidden h-full min-h-[350px] py-8 md:py-12 shadow-xl">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241.11621293232892!2d121.45716741975448!3d12.858143003245825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bb57b0a29423f5%3A0xb5ac567eccc2ed69!2sBedazzle%20Caf%C3%A9!5e0!3m2!1sen!2sus!4v1715061128274!5m2!1sen!2sus" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0, minHeight: '350px' }} 
                                    allowFullScreen 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="B'Dazzle Café - Corner of Strong Republic Nautical Highway & Lusterio St, Bansud, Oriental Mindoro"
                                    className="rounded-lg"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer Main Content */}
            <div className="bg-brown-primary text-white py-16">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Company Info */}
                        <div>
                            <div className="flex items-center mb-5">
                                <div className="bg-white rounded-full p-2 mr-3 shadow-md">
                                    <img 
                                        src="/img/logo.png" 
                                        alt="B'Dazzle Logo" 
                                        className="h-12 w-auto" 
                                    />
                                </div>
                                <h3 className="text-2xl font-playfair">B'Dazzle Café</h3>
                            </div>
                            <p className="mb-6 text-white/85 leading-relaxed">
                                Experience the perfect blend of comfort and flavor at B'Dazzle Café, where every cup tells a story and every moment is crafted for your enjoyment.
                            </p>
                            <div className="flex items-center mb-3">
                                <Mail className="text-yellow-primary mr-3 h-5 w-5" />
                                <a href="mailto:hello@bdazzlecafe.com" className="hover:text-yellow-primary transition-colors">
                                    hello@bdazzlecafe.com
                                </a>
                            </div>
                            <div className="flex items-center">
                                <Phone className="text-yellow-primary mr-3 h-5 w-5" />
                                <a href="tel:+6398765432" className="hover:text-yellow-primary transition-colors">
                                    +63 987 654 3210
                                </a>
                            </div>
                        </div>
                        
                        {/* Quick Links */}
                        <div className="mt-8 md:mt-0">
                            <h3 className="text-xl font-bold mb-5 text-yellow-primary">Explore</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/menu" className="hover:text-yellow-primary transition-colors flex items-center">
                                        <span className="mr-2">›</span>Our Menu
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about-us" className="hover:text-yellow-primary transition-colors flex items-center">
                                        <span className="mr-2">›</span>About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/gallery" className="hover:text-yellow-primary transition-colors flex items-center">
                                        <span className="mr-2">›</span>Gallery
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/events" className="hover:text-yellow-primary transition-colors flex items-center">
                                        <span className="mr-2">›</span>Events & Promotions
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Resources & Social Media */}
                        <div className="mt-8 md:mt-0">
                            <h3 className="text-xl font-bold mb-5 text-yellow-primary">Information</h3>
                            <ul className="space-y-3 mb-8">
                                <li>
                                    <Link href="/opening-hours" className="hover:text-yellow-primary transition-colors flex items-center">
                                        <span className="mr-2">›</span>Opening Hours
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/reservations" className="hover:text-yellow-primary transition-colors flex items-center">
                                        <span className="mr-2">›</span>Reservations
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy-policy" className="hover:text-yellow-primary transition-colors flex items-center">
                                        <span className="mr-2">›</span>Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms-conditions" className="hover:text-yellow-primary transition-colors flex items-center">
                                        <span className="mr-2">›</span>Terms & Conditions
                                    </Link>
                                </li>
                            </ul>
                            
                            <h3 className="text-xl font-bold mb-5 text-yellow-primary">Stay Connected</h3>
                            <div className="flex space-x-4">
                                <Link href="https://facebook.com" className="bg-white/10 p-2.5 rounded-full hover:bg-yellow-primary hover:text-brown-primary transition-colors" aria-label="Facebook">
                                    <Facebook size={20} />
                                </Link>
                                <Link href="https://twitter.com" className="bg-white/10 p-2.5 rounded-full hover:bg-yellow-primary hover:text-brown-primary transition-colors" aria-label="Twitter">
                                    <Twitter size={20} />
                                </Link>
                                <Link href="https://instagram.com" className="bg-white/10 p-2.5 rounded-full hover:bg-yellow-primary hover:text-brown-primary transition-colors" aria-label="Instagram">
                                    <Instagram size={20} />
                                </Link>
                                <Link href="https://linkedin.com" className="bg-white/10 p-2.5 rounded-full hover:bg-yellow-primary hover:text-brown-primary transition-colors" aria-label="LinkedIn">
                                    <Linkedin size={20} />
                                </Link>
                                <Link href="https://youtube.com" className="bg-white/10 p-2.5 rounded-full hover:bg-yellow-primary hover:text-brown-primary transition-colors" aria-label="YouTube">
                                    <Youtube size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Copyright section */}
                    <div className="mt-16 pt-8 border-t border-white/20 text-center text-white/70">
                        <p>© {new Date().getFullYear()} B'Dazzle Café. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;