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
*   **Ventas Históricas**: Creará registros de ventas desde hace 30 días hasta hoy.
    *   **Crecimiento Gradual**: Las ventas serán pocas al inicio del mes y aumentarán al final.
    *   **Irregularidad**: Algunos días tendrán "caos" (fluctuaciones) y los fines de semana tendrán menos actividad para que se vea real.

## 📈 Verificación en el Sistema

### En la Aplicación Web:
1.  Inicia sesión en el Frontend.
2.  Ve a la sección de **Dashboard** o **Analíticas**.
3.  Verás que las gráficas de "Ventas por Día" y "Rentabilidad" ya no están vacías; ahora muestran la curva de los últimos 30 días.

### En BigQuery:
1.  Una vez que PostgreSQL tiene los datos, usa el endpoint de **Benchmarking** (disponible en Postman) para enviar el "Daily Snapshot".
2.  BigQuery recibirá todas las métricas de las consultas que NestJS ejecutó durante el proceso de seeding.

---
**Nota:** El script respeta los usuarios existentes. Si ya tienes 30 usuarios o más, no creará nuevos, solo generará ventas entre los que ya están registrados.
