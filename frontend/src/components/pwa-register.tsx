'use client';

import { useEffect } from 'react';

export function PwaRegister() {
    useEffect(() => {
        if ('serviceWorker' in navigator && window.location.protocol !== 'http:') {
            // Only register in secure contexts (https or localhost)
            // But localhost is http usually. SW works on localhost too.
            // Let's remove protocol check for dev.
        }

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }, []);

    return null;
}
