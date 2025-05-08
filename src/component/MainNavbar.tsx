'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, ShoppingCart, X, User, Package, Settings, LogOut, BarChart2, HelpCircle, Moon } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const navLinks = [
  { name: 'Products', href: '/products' },
  { name: 'About us', href: '/about' },
  { name: 'Testimonial', href: '/testimonial' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { data: session } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // State for scroll behavior
  const [visible, setVisible] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY;
      
      // Show navbar when scrolling occurs
      setVisible(true);
      
      // Clear previous timer
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      
      // Set new timer to hide navbar after scrolling stops
      scrollTimerRef.current = setTimeout(() => {
        if (currentPosition > 100) { // Only hide when scrolled down
          setVisible(false);
        }
      }, 1500); // Adjust timing as needed (1.5 seconds)
      
      setScrollPosition(currentPosition);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);
  
  // Show navbar when at top of page
  useEffect(() => {
    if (scrollPosition <= 100) {
      setVisible(true);
    }
  }, [scrollPosition]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Here you would implement the actual dark mode toggle logic
  };

  return (
    <header 
      className={`w-full px-6 py-4 bg-brown-primary fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ${
        visible ? 'transform-none shadow-lg' : 'transform -translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <img src="/img/logo.png" alt="B'Dazzle Cafe" className="h-8 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative font-nunito font-medium transition ${
                pathname === link.href ? 'text-yellow-400' : 'text-white'
              } hover:text-yellow-400`}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400" />
              )}
            </Link>
          ))}
        </nav>

        {/* Auth buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {session ? (
            <>
              {/* User dropdown menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center text-white hover:text-yellow-400 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-2 flex items-center justify-center overflow-hidden">
                    {session.user?.image ? (
                      <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-gray-700">
                        {session.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                  </div>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-1 z-50">
                    {/* User info section */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 flex items-center justify-center overflow-hidden">
                        {session.user?.image ? (
                          <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-lg text-gray-700">
                            {session.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-gray-800 font-semibold font-nunito">{session.user?.name || 'User'}</p>
                        <p className="text-gray-500 text-sm font-nunito">
                          {session.user?.email || ''}
                          <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-gray-800 text-white rounded-sm">PRO</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Menu items */}
                    <div className="py-1">
                      <Link 
                        href="/profile" 
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 font-nunito"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-5 w-5 mr-3 text-gray-500" />
                        View Profile
                      </Link>
                      
                      <Link 
                        href="/analytics" 
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 font-nunito"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <BarChart2 className="h-5 w-5 mr-3 text-gray-500" />
                        Analytics & Data
                      </Link>
                      
                      <Link 
                        href="/help" 
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 font-nunito"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <HelpCircle className="h-5 w-5 mr-3 text-gray-500" />
                        Help Center
                      </Link>
                      
                      <Link 
                        href="/settings" 
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 font-nunito"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5 mr-3 text-gray-500" />
                        Account Settings
                      </Link>
                      
                      <Link 
                        href="/upgrade" 
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 font-nunito"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-gray-500">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        Upgrade Plan
                      </Link>
                      
                      <div 
                        className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 font-nunito cursor-pointer"
                        onClick={toggleDarkMode}
                      >
                        <div className="flex items-center">
                          <Moon className="h-5 w-5 mr-3 text-gray-500" />
                          Dark Mode
                        </div>
                        <div className={`w-10 h-5 rounded-full flex items-center ${darkMode ? 'bg-blue-500' : 'bg-gray-300'} transition-colors`}>
                          <span className={`h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-1'}`}></span>
                        </div>
                      </div>
                      
                      <button
                        className="flex w-full items-center px-4 py-3 text-gray-700 hover:bg-gray-50 font-nunito"
                        onClick={() => {
                          signOut();
                          setUserMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-5 w-5 mr-3 text-gray-500" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <Link 
                href="/cart"
                className="text-white hover:text-yellow-400 transition relative"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-brown-primary rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                  2
                </span>
              </Link>
            </>
          ) : (
            <Link
              href="/account/sign-up"
              className="inline-block px-5 py-2 bg-yellow-400 text-black font-nunito font-semibold rounded-full hover:bg-yellow-300 transition"
            >
              Sign Up
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 px-6 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block font-nunito font-medium transition ${
                pathname === link.href ? 'text-yellow-400' : 'text-white'
              } hover:text-yellow-400`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {session ? (
            <>
              <div className="text-white font-nunito font-medium text-center border-t border-white/20 pt-4 mt-4 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-2 flex items-center justify-center overflow-hidden">
                  {session.user?.image ? (
                    <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-gray-700">
                      {session.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
                <span>Hi, {session.user?.name}</span>
              </div>
              
              <Link 
                href="/profile"
                className="block font-nunito font-medium text-white hover:text-yellow-400 transition"
                onClick={() => setIsOpen(false)}
              >
                <User className="inline-block mr-2 h-4 w-4" />
                View Profile
              </Link>
              
              <Link 
                href="/analytics"
                className="block font-nunito font-medium text-white hover:text-yellow-400 transition"
                onClick={() => setIsOpen(false)}
              >
                <BarChart2 className="inline-block mr-2 h-4 w-4" />
                Analytics & Data
              </Link>
              
              <Link 
                href="/help"
                className="block font-nunito font-medium text-white hover:text-yellow-400 transition"
                onClick={() => setIsOpen(false)}
              >
                <HelpCircle className="inline-block mr-2 h-4 w-4" />
                Help Center
              </Link>
              
              <Link 
                href="/settings"
                className="block font-nunito font-medium text-white hover:text-yellow-400 transition"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="inline-block mr-2 h-4 w-4" />
                Account Settings
              </Link>
              
              <Link 
                href="/cart" 
                className="block font-nunito font-medium text-white hover:text-yellow-400 transition" 
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart className="inline-block mr-2 h-4 w-4" />
                My Cart
              </Link>
              
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="block w-full text-center px-5 py-2 mt-4 bg-yellow-400 text-black font-nunito font-semibold rounded-full hover:bg-yellow-300 transition"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              href="/account/sign-up"
              className="block w-full text-center px-5 py-2 mt-2 bg-yellow-400 text-black font-nunito font-semibold rounded-full hover:bg-yellow-300 transition"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          )}
        </div>
      )}
    </header>
  );
}