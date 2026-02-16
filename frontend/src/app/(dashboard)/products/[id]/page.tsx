export default function ProductDetailPage({
    params,
}: {
    params: { id: string };
}) {
    return (
        <main>
            <h1>Detalle del Producto</h1>
            <p>ID: {params.id}</p>
        </main>
    );
}
