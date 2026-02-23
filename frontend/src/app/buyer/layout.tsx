import { redirect } from 'next/navigation';

export default function BuyerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Nota: La validación de autenticación real ocurrirá
    // en los componentes cliente que usen useAuthStore()
    // ya que este layout se renderiza en el cliente para el estado Zustand.

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-1 pb-16 md:pb-0">
                {children}
            </main>
        </div>
    );
}
