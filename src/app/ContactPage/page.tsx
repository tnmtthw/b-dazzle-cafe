'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        try {
            // Here you would normally send the data to your API
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Message sent successfully!');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <Toaster position="bottom-right" />
            
            {/* Background Image with overlay */}
            <div className="absolute inset-0">
                <Image
                    src="/img/bg-contact.png" 
                    alt="Contact Background"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
                {/* Section Header */}
                <div className="mb-12 text-center">
                    <h2 className="font-playfair font-bold text-5xl md:text-6xl lg:text-7xl text-white mb-2">
                        <span className="text-white">Contact</span> Us
                    </h2>
                    <div className="w-24 h-1 bg-yellow-primary mt-6 mx-auto"></div>
                    <p className="text-white text-lg mt-6 max-w-2xl mx-auto">
                        Have questions about our menu, services, or want to provide feedback? 
                        We'd love to hear from you. Get in touch with us using any of the methods below.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Form */}
                    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-tr-[40px] rounded-bl-[40px] shadow-xl">
                        <h3 className="font-playfair text-2xl font-bold text-brown-primary mb-6">Send us a message</h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                                    <input 
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-primary focus:border-brown-primary transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Your Email</label>
                                    <input 
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-primary focus:border-brown-primary transition-colors"
                                        placeholder="johndoe@example.com"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-primary focus:border-brown-primary transition-colors"
                                >
                                    <option value="">Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="reservation">Reservation</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="catering">Catering Services</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-primary focus:border-brown-primary transition-colors"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="bg-brown-primary hover:bg-brown-primary-hover text-white py-4 px-8 rounded-tr-[20px] rounded-bl-[20px] font-medium transition-colors flex items-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-tr-[40px] rounded-bl-[40px] shadow-xl">
                            <h3 className="font-playfair text-2xl font-bold text-brown-primary mb-6">Contact Information</h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-yellow-primary p-3 rounded-full mr-4">
                                        <MapPin className="h-6 w-6 text-brown-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Address</h4>
                                        <p className="text-gray-600 mt-1">Nautical Highway, Cor Lusterio St, Bansud, 5210 Oriental Mindoro</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-yellow-primary p-3 rounded-full mr-4">
                                        <Phone className="h-6 w-6 text-brown-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Phone</h4>
                                        <p className="text-gray-600 mt-1">+63 912 345 6789</p>
                                        <p className="text-gray-600">+63 456 789 0123</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-yellow-primary p-3 rounded-full mr-4">
                                        <Mail className="h-6 w-6 text-brown-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Email</h4>
                                        <p className="text-gray-600 mt-1">info@bdazzlecafe.com</p>
                                        <p className="text-gray-600">support@bdazzlecafe.com</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-yellow-primary p-3 rounded-full mr-4">
                                        <Clock className="h-6 w-6 text-brown-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Opening Hours</h4>
                                        <p className="text-gray-600 mt-1">Monday to Friday: 8:00 AM - 10:00 PM</p>
                                        <p className="text-gray-600">Saturday & Sunday: 9:00 AM - 11:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Map */}
                        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-tr-[40px] rounded-bl-[40px] shadow-xl">
                            <h3 className="font-playfair text-2xl font-bold text-brown-primary mb-6">Find Us</h3>
                            
                            <div className="h-[300px] w-full rounded-lg overflow-hidden">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241.11621293232892!2d121.45716741975448!3d12.858143003245825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bb57b0a29423f5%3A0xb5ac567eccc2ed69!2sBedazzle%20Caf%C3%A9!5e0!3m2!1sen!2sus!4v1715061128274!5m2!1sen!2sus" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="B'Dazzle Cafe Location"
                                    className="rounded-lg"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Social Media Section */}
                <div className="mt-16 text-center">
                    <h3 className="font-playfair text-2xl font-bold text-white mb-6">Connect With Us</h3>
                    <div className="flex justify-center space-x-6">
                        <a href="#" className="bg-white/90 p-4 rounded-full hover:bg-yellow-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brown-primary">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        <a href="#" className="bg-white/90 p-4 rounded-full hover:bg-yellow-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brown-primary">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        <a href="#" className="bg-white/90 p-4 rounded-full hover:bg-yellow-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brown-primary">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                            </svg>
                        </a>
                        <a href="#" className="bg-white/90 p-4 rounded-full hover:bg-yellow-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brown-primary">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;