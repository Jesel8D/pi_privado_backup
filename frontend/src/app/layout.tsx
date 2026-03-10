import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { PwaRegister } from '@/components/pwa-register';
import { GoogleProvider } from '@/components/providers/google-provider';

export const metadata: Metadata = {
    title: 'TienditaCampus',
    description: 'Herramientas digitales para vendedores universitarios',
    manifest: '/manifest.json',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className="antialiased">
                <GoogleProvider>
                    {children}
                </GoogleProvider>
                <PwaRegister />
                <Toaster position="top-center" richColors />
            </body>
        </html>
    );
}
