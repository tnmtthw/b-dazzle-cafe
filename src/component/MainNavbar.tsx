'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, ShoppingCart, X, User, Package } from 'lucide-react';
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
              className={`relative font-medium transition ${
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
                  <span className="mr-2">Hi, {session.user?.name}</span>
                  <User className="h-5 w-5" />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="inline-block h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                    <Link 
                      href="/profile/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Package className="inline-block h-4 w-4 mr-2" />
                      My Orders
                    </Link>
                    <hr className="my-1" />
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
              
              <Link 
                href="/cart"
                className="text-white hover:text-yellow-400 transition"
              >
                <ShoppingCart className="h-6 w-6" />
              </Link>
            </>
          ) : (
            <Link
              href="/account/sign-up"
              className="inline-block px-5 py-2 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-300 transition"
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
              className={`block font-medium transition ${
                pathname === link.href ? 'text-yellow-400' : 'text-white'
              } hover:text-yellow-400`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {session ? (
            <>
              <div className="text-white font-medium text-center border-t border-white/20 pt-4 mt-4">
                Hi, {session.user?.name}
              </div>
              
              <Link 
                href="/profile"
                className="block font-medium text-white hover:text-yellow-400 transition"
                onClick={() => setIsOpen(false)}
              >
                <User className="inline-block mr-2 h-4 w-4" />
                My Profile
              </Link>
              
              <Link 
                href="/profile/orders"
                className="block font-medium text-white hover:text-yellow-400 transition"
                onClick={() => setIsOpen(false)}
              >
                <Package className="inline-block mr-2 h-4 w-4" />
                My Orders
              </Link>
              
              <Link 
                href="/cart" 
                className="block font-medium text-white hover:text-yellow-400 transition" 
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
                className="block w-full text-center px-5 py-2 mt-4 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-300 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/account/sign-up"
              className="block w-full text-center px-5 py-2 mt-2 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-300 transition"
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