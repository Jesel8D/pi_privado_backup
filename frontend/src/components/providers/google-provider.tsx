'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export function GoogleProvider({ children }: { children: React.ReactNode }) {
    // Provide a dummy client ID so the React Context doesn't crash if the env var is missing/unloaded.
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'missing_client_id_placeholder.apps.googleusercontent.com';

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
