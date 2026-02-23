# Reporte de Integración Backend a Frontend - TienditaCampus

Este documento consolida el plan de implementación Frontend para conectar los nuevos endpoints del Backend (fases del Comprador y Vendedor). El stack tecnológico identificado para esta integración es **Next.js 14**, **React 18**, **Tailwind CSS**, **Zustand** (para estado global), **React Hook Form + Zod** (para manejo de formularios y validaciones) y **Recharts** (para gráficas).

---

## Fase 1: Experiencia del Comprador (Buyer)

### 1. HU-05: Catálogo Público (`GET /api/products/marketplace`)
**Objetivo:** Mostrarle al comprador los productos disponibles con inventario activo.
- **Acciones Frontend a implementar:**
  - [ ] **Crear Servicio:** Función `getMarketplaceProducts({ page, search })` en `src/services/product.service.ts`.
  - [ ] **Desarrollo de Vista (`/marketplace` o `/`):** Diseñar un `ProductGrid` que itere los productos mapeados.
  - [ ] **Paginación / Scroll infinito:** Implementar la paginación según lo requiera el estado actual, apoyando un input de búsqueda que envíe la variable `q`.
  - [ ] **Componente de Tarjeta (`ProductCard`):** Asegurar que se visualice correctamente la cantidad `quantity_remaining` mostrada.

### 2. HU-06: Perfil Público del Vendedor (`GET /api/users/public/:id`)
**Objetivo:** Renderizar el "menú" del vendedor mostrando su perfil y productos con stock en tiempo real.
- **Acciones Frontend a implementar:**
  - [ ] **Crear Servicio:** Función `getSellerProfile(sellerId)` en `src/services/user.service.ts`.
  - [ ] **Desarrollo de Vista (`/seller/[id]`):** Crear una página en Next.js App Router (o Pages) que reciba el ID como parámetro.
  - [ ] **Componente de Cabecera (`SellerHeader`):** Mostrar el avatar y nombre del vendedor.
  - [ ] **Listado de Productos:** Iterar el array incrustado de productos obtenidos del endpoint, reciclando el componente `ProductCard`.

---

## Fase 2 & 3: Experiencia del Vendedor (Seller)

### 3. HU-02: Dashboard de Rentabilidad (ROI) (`GET /api/sales/roi`)
**Objetivo:** Brindar a los vendedores información financiera (inversión vs ganancias) filtrada por rango de fechas.
- **Acciones Frontend a implementar:**
  - [ ] **Crear Servicio:** Función `getSellerROI(startDate, endDate)` en `src/services/sales.service.ts`.
  - [ ] **Desarrollo de Vista (`/dashboard`):** Agregar selectores de fecha (`DatePicker`) usando componentes de Radix UI o un calendario personalizado acoplado a React Hook Form.
  - [ ] **Gráficos (`Recharts`):** Implementar componentes `<BarChart>` o `<LineChart>` para graficar la ganancia neta y la evolución financiera del día, semana o mes.

### 4. HU-03: Predicción de Demanda (`GET /api/sales/prediction`)
**Objetivo:** Sugerir dinámicamente cuántas unidades preparar para evitar merma.
- **Acciones Frontend a implementar:**
  - [ ] **Crear Servicio:** Función `getSalesPrediction()` en `src/services/sales.service.ts`.
  - [ ] **Desarrollo de Componente (`PredictionWidget`):** Un bloque visual en el dashboard del vendedor (ej. un banner o tarjeta destacada con ícono de Lucide React, como `TrendingUp` o `Lightbulb`) que indique `suggestedQuantity` y los recomiende preparar exactamente esa cantidad.

### 5. HU-04: Cierre de Día y Registro de Merma (`POST /api/sales/close-day`)
**Objetivo:** Enviar la información de productos no vendidos (merma) para cerrar sus registros diarios.
- **Acciones Frontend a implementar:**
  - [ ] **Crear Servicio:** Función `closeDay(items)` usando método POST en `src/services/sales.service.ts`.
  - [ ] **Desarrollo de Formulario (`CloseDayModal`):** Un modal/dialog (Radix UI `Dialog`) con `react-hook-form` y validaciones usando `zod`.
  - [ ] **Input Dinámico:** Usar `useFieldArray` para el array de `items: [{ productId, waste }]`. El usuario pondrá qué le sobró (merma).
  - [ ] **Feedback (`Sonner`):** Luego del "submit" exitoso, mostrar un toast de confirmación y redirigir o recargar los datos financieros (ROI).

---

## 🚀 Siguientes Pasos (Para el equipo de Frontend)

1. **Configurar Cliente API (`axios` o `fetch` global):** Asegurar un interceptor que adjunte el token (`Bearer <token>`) en las peticiones privadas (HU-02, HU-03, HU-04). Las públicas (HU-05, HU-06) pueden accederse sin el Bearer token de ser necesario.
2. **Definir Tipado Estricto (TypeScript):** Crear en el frontend los `interfaces`/`types` que hagan match uno-a-uno con los DTOs que ahora devuelve el backend para disfrutar de auto-completado y seguridad.
3. **Distribución de Tareas:** Asignen estas 5 funcionalidades principales a los miembros del equipo en su tablero de Jira/Trello para comenzar a desarrollar los componentes indicados paralelamente.

*Archivo generado automáticamente tras la consolidación de los avances del Backend.*
