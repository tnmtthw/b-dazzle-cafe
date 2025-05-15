"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import MainNavbar from "@/components/layout/MainNavbar";
import { toSlug } from "@/utils/toSlug";

export const Navbar = () => {
    const { data: session } = useSession();
    const pathname = usePathname(); // Get current path

    // Routes where the navbar should be hidden
    const hiddenRoutes = [
        "/preview",
        "/admin",
        "/user/templates",
        "/juantap-help-support",
    ];

    // Hide navbar if pathname starts with or includes any of the hidden routes
    if (hiddenRoutes.some((route) => pathname.startsWith(route))) {
        return null;
    }

    // if (pathname.includes(`${toSlug(session?.user?.name || "user")}`)) {
    //     return null;
    // }

    return pathname.startsWith("/user") ? "Testing" : <MainNavbar />;
};

export default Navbar; 