'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function AccountVerificationClient({ email }: { email: string }) {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await fetch(`/api/auth/sign-up?email=${email}`, {
                    method: 'PATCH',
                });

                setStatus(res.ok ? 'success' : 'error');
            } catch {
                setStatus('error');
            }
        };

        verifyUser();
    }, [email]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                        <h1 className="text-xl font-semibold mb-2">Verifying your account…</h1>
                        <p className="text-gray-600">Please wait while we confirm your email address.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <h1 className="text-xl font-semibold mb-2">You're verified!</h1>
                        <p className="text-gray-600">Your email has been successfully verified.</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                        <h1 className="text-xl font-semibold mb-2">Verification failed</h1>
                        <p className="text-gray-600">We couldn't verify <strong>{email}</strong>. Please try again later.</p>
                    </>
                )}
            </div>
        </div>
    );
}
