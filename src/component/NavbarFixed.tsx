'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'About us', href: '/about' },
    { name: 'Testimonial', href: '/testimonial' },
    { name: 'Contact', href: '/contact' },
];

export default function NavbarFixed() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 w-full bg-transparent z-50">
            <div className="mx-auto px-6 py-4 grid grid-cols-3 items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/">
                        <img src="/img/logo.png" alt="B'Dazzle Cafe" className="h-8 w-auto" />
                    </Link>
                </div>

                {/* Nav links */}
                <div className="flex justify-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`relative text-white font-medium hover:text-yellow-400 transition ${pathname === link.href
                                ? 'text-yellow-400'
                                : 'text-white'
                                }`}
                        >
                            {link.name}
                            {pathname === link.href && (
                                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Sign up button */}
                <div className="flex justify-end">
                    <Link
                        href="/signup"
                        className="inline-block px-5 py-2 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-300 transition"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
}
