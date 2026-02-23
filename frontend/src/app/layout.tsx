import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { PwaRegister } from '@/components/pwa-register';
import { GoogleProvider } from '@/components/providers/google-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
            <body className={`${inter.variable} antialiased`}>
                <GoogleProvider>
                    {children}
                </GoogleProvider>
                <PwaRegister />
                <Toaster position="top-center" richColors />
            </body>
        </html>
    );
}
