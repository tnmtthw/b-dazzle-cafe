'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
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
  const { data: session } = useSession();

  return (
    <header className="w-full px-6 py-4 bg-transparent">
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
              className={`relative font-medium transition ${pathname === link.href ? 'text-yellow-400' : 'text-white'
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
              <span className="text-white font-medium">Hi, {session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="px-5 py-2 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-300 transition"
              >
                Sign Out
              </button>
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
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block font-medium transition ${pathname === link.href ? 'text-yellow-400' : 'text-white'
                } hover:text-yellow-400`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {session ? (
            <>
              <div className="text-white font-medium text-center">
                Hi, {session.user?.name}
              </div>
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="block w-full text-center px-5 py-2 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-300 transition"
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