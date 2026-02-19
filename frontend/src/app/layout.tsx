import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { PwaRegister } from '@/components/pwa-register';

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
                {children}
                <PwaRegister />
                <Toaster position="top-center" richColors />
            </body>
        </html>
    );
}
