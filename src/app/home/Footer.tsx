import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, ExternalLink } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full">
            {/* Location Section */}
            <div className="bg-white w-full py-12">
                <div className="max-w-6xl mx-auto px-8">
                    {/* Section Header */}
                    <div className="mb-8">
                        <h2 className="text-4xl font-playfair font-bold text-black mb-2">We are Located at</h2>
                        <div className="w-full border-t border-gray-400"></div>
                    </div>
                </div>
                
                {/* Full width background with constrained content */}
                <div className="bg-[#262626] w-full">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            {/* Address */}
                            <div className="text-white p-8 md:p-12">
                                <div className="mb-8">
                                    <p className="text-xl mb-1">Nautical Highway, Cor Lusterio</p>
                                    <p className="text-xl mb-1">St, Bansud, 5210 Oriental</p>
                                    <p className="text-xl mb-4">Mindoro</p>
                                    <div className="flex space-x-2 items-center">
                                        <div className="w-3 h-8 bg-white"></div>
                                        <div className="w-3 h-8 bg-white"></div>
                                    </div>
                                </div>
                                
                                <Link 
                                    href="https://maps.google.com" 
                                    target="_blank" 
                                    className="inline-flex items-center bg-white text-black py-2 px-6 rounded hover:bg-gray-100 transition-colors"
                                >
                                    <span className="mr-2">Get Directions Now</span>
                                    <ExternalLink size={16} />
                                </Link>
                            </div>
                            
                            {/* Map */}
                            <div className="rounded-lg overflow-hidden h-full min-h-[300px] py-8 md:py-12">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241.11621293232892!2d121.45716741975448!3d12.858143003245825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bb57b0a29423f5%3A0xb5ac567eccc2ed69!2sBedazzle%20Caf%C3%A9!5e0!3m2!1sen!2sus!4v1715061128274!5m2!1sen!2sus" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0, minHeight: '300px' }} 
                                    allowFullScreen 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Bedazzle Café - Corner of Strong Republic Nautical Highway & Lusterio St, Bansud, Oriental Mindoro"
                                    className="rounded-lg"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer Main Content */}
            <div className="bg-brown-primary text-white py-12">
                <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center mb-4">
                            <img 
                                src="/img/logo.png" 
                                alt="B'Dazzle Logo" 
                                className="h-12 w-auto mr-4" 
                            />
                            <h3 className="text-2xl font-playfair">B' Dazzle</h3>
                        </div>
                        <p className="mb-6">
                            Discover tranquility at NgopI, a sanctuary for unwinding, where your evenings are perfected with relaxation and rich flavors.
                        </p>
                        <p className="mb-1">hello@ngopi.com</p>
                        <p>Phone : +01 23456789</p>
                    </div>
                    
                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/services" className="hover:text-yellow-primary transition-colors">Services</Link></li>
                            <li><Link href="/portfolio" className="hover:text-yellow-primary transition-colors">Portfolio</Link></li>
                            <li><Link href="/about-us" className="hover:text-yellow-primary transition-colors">About us</Link></li>
                            <li><Link href="/testimonial" className="hover:text-yellow-primary transition-colors">Testimonial</Link></li>
                        </ul>
                    </div>
                    
                    {/* Resources */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li><Link href="/support" className="hover:text-yellow-primary transition-colors">Support</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-yellow-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms-conditions" className="hover:text-yellow-primary transition-colors">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                    
                    {/* Social Media & Subscribe */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Social Media</h3>
                        <div className="flex space-x-4 mb-8">
                            <Link href="https://facebook.com" className="hover:text-yellow-primary transition-colors" aria-label="Facebook">
                                <Facebook size={20} />
                            </Link>
                            <Link href="https://twitter.com" className="hover:text-yellow-primary transition-colors" aria-label="Twitter">
                                <Twitter size={20} />
                            </Link>
                            <Link href="https://instagram.com" className="hover:text-yellow-primary transition-colors" aria-label="Instagram">
                                <Instagram size={20} />
                            </Link>
                            <Link href="https://linkedin.com" className="hover:text-yellow-primary transition-colors" aria-label="LinkedIn">
                                <Linkedin size={20} />
                            </Link>
                            <Link href="https://youtube.com" className="hover:text-yellow-primary transition-colors" aria-label="YouTube">
                                <Youtube size={20} />
                            </Link>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-4">Subscribe</h3>
                        <div className="flex">
                            <input 
                                type="email" 
                                placeholder="name@domain.com"
                                className="bg-brown-primary border border-gray-600 px-4 py-2 rounded-l w-full focus:outline-none focus:border-yellow-primary"
                            />
                            <button className="bg-yellow-primary text-brown-primary px-4 py-2 rounded-r font-medium hover:bg-yellow-400 transition-colors">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;