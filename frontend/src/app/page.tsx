'use client';

import { useEffect } from 'react';

export default function Home() {
    // Registrar Service Worker para PWA
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('SW registrado:', registration.scope);
                })
                .catch((error) => {
                    console.error('Error al registrar SW:', error);
                });
        }
    }, []);

    return (
        <main>
            <h1>🏪 TienditaCampus</h1>
            <p>Herramientas digitales para vendedores universitarios</p>
        </main>
    );
}
