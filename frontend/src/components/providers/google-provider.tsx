'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export function GoogleProvider({ children }: { children: React.ReactNode }) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

    if (!clientId) {
        console.warn('Google Client ID is missing. OAuth Benchmarking will not work.');
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
