# 📊 Guía de Generación de Datos Históricos (Data Factory)

Esta guía explica cómo poblar tu sistema con **30 días de historial**, **30 usuarios** (vendedores y compradores) y métricas listas para **BigQuery**.

## 🚀 Pasos para Ejecutar el Script

El script `data-factory.ts` se encuentra en `backend/scripts/`. Sigue estos pasos para correrlo:

### 1. Preparación
Asegúrate de estar en la carpeta del backend de tu proyecto:
```bash
cd backend
```

### 2. Ejecución del Seeding
Usa `ts-node` para ejecutar el script de generación masiva:
```bash
npx ts-node scripts/data-factory.ts
```

### 3. ¿Qué hará el script?
*   **Usuarios**: Revisará cuántos usuarios tienes. Si hay menos de 30, creará nuevos (hasta llegar a 15 vendedores y 15 compradores).
*   **Productos**: Creará un catálogo base para los nuevos vendedores si no lo tienen.
*   **Ventas Históricas**: Creará registros de ventas de los últimos 30 días en PostgreSQL.

## 📈 Paso 4: Exportación a BigQuery (Histórica)

Una vez que PostgreSQL tiene los datos, debes enviarlos a BigQuery para que tus dashboards en la nube se actualicen.

1.  Abre **Postman**.
2.  Ve a la carpeta **BigQuery Benchmarking**.
3.  Ejecuta `1. Get Google Auth URL` y pega el link en tu navegador para obtener tu **Token**.
4.  Pega el Token en las variables de Postman.
5.  Ejecuta `2. Run Benchmarking Queries` (para que el sistema registre las métricas base).
6.  **IMPORTANTE**: Ejecuta el nuevo request `3. Send Historical Snapshot to BigQuery`.
    *   Este request enviará automáticamente los **30 días de métricas simuladas** a BigQuery en un solo paso.
    *   Verás que BigQuery ahora tiene datos graduados e irregulares de todo el mes.

---
**Nota:** El script respeta los usuarios existentes. Si ya tienes 30 usuarios o más, no creará nuevos, solo generará ventas entre los que ya están registrados.
