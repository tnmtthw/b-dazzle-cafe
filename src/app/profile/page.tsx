"use client";

import { useSession, signOut } from "next-auth/react";

const UserProfile = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <div>You are not logged in</div>;
    }

    const handleLogout = () => {
        signOut({}); // You can specify the redirect after logout
    };

    return (
        <div>
            <h1>Welcome, {session.user?.name || session.user?.email}</h1>
            <p>Your ID: {session.user?.id}</p>
            <p>Your email: {session.user?.email}</p>
            <p>Your role: {session.user?.role}</p>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white p-2 rounded mt-4"
            >
                Logout
            </button>
        </div>
    );
};

export default UserProfile;
