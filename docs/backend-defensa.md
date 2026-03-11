# Documentación Backend - Defensa TienditaCampus

## 🎯 **Objetivo: Defensa Backend con Benchmarking y Base de Datos**

---

## 📋 **ÍNDICE POR ARCHIVOS**

### 🔥 **ARCHIVOS CLAVE PARA DEFENSA**

#### **1. Backend Principal - `backend/src/main.ts`**
```typescript
// ¿POR QUÉ ES IMPORTANTE?
// - Punto de entrada de toda la aplicación
// - Configura middleware global, CORS, validación
// - Define el prefijo global '/api'
// - Maneja limites de tamaño para archivos (10MB)
```

**¿Qué explicar?**
- **Global Prefix**: `/api` - Todas las rutas empiezan con `/api`
- **CORS**: Permite peticiones desde frontend (`localhost:3000`)
- **Body Parser**: Límite de 10MB para imágenes en base64
- **Validation Pipe**: Valida automáticamente todos los DTOs

---

#### **2. Configuración Base de Datos - `backend/src/config/database.config.ts`**
```typescript
// ¿POR QUÉ ES IMPORTANTE?
// - Configura TypeORM con PostgreSQL
// - Habilita pg_stat_statements para benchmarking
// - Define logging y sincronización
// - Maneja conexión a base de datos principal
```

**¿Qué explicar?**
- **TypeORM**: ORM para TypeScript con PostgreSQL
- **pg_stat_statements**: **¡CRUCIAL!** - Habilita métricas de queries para benchmarking
- **Logging**: Nivel de logging para desarrollo/producción
- **Synchronize**: false en producción (migraciones manuales)

---

#### **3. Módulo Principal - `backend/src/app.module.ts`**
```typescript
// ¿POR QUÉ ES IMPORTANTE?
// - Módulo raíz que importa todos los demás
// - Configura conexión a base de datos
// - Registra HealthController para monitoreo
// - Define la estructura modular del sistema
```

**¿Qué explicar?**
- **TypeOrmModule**: Conexión a PostgreSQL con todas las entidades
- **BenchmarkingModule**: **¡MUY IMPORTANTE!** - Módulo de análisis de rendimiento
- **HealthController**: Endpoint `/api/health` para Docker health checks

---

## 🏗️ **MÓDULOS DE NEGOCIO**

### **4. Módulo de Ventas - `backend/src/modules/sales/`**

#### **`sales.service.ts`**
```typescript
// ¿POR QUÉ ES IMPORTANTE?
// - Lógica de negocio principal de ventas
// - Usa patrón de Use Cases para separar responsabilidades
// - Calcula métricas en tiempo real (ROI, profit margin)
// - Implementa predicciones con método IQR
```

**¿Qué explicar?**
- **Patrón Use Cases**: `CreateDailySaleUseCase`, `TrackSaleUseCase`, `CloseDayUseCase`
- **Repository Pattern**: `SalesRepository` para acceso a datos
- **Métricas de Negocio**: ROI, profit margin, break-even
- **Predicción IQR**: Método estadístico para predecir ventas

#### **`sales.repository.ts`**
```typescript
// ¿POR QUÉ ES IMPORTANTE?
// - Acceso a datos de ventas con SQL optimizado
// - Implementa vistas materializadas para rendimiento
// - Contiene lógica de consultas complejas
// - Maneja transacciones y concurrencia
```

**¿Qué explicar?**
- **Vistas Materializadas**: `vw_product_performance`, `vw_daily_metrics`
- **Consultas Optimizadas**: JOINs, agregaciones, subconsultas
- **Funciones Estadísticas**: Cálculo de percentiles, promedios móviles
- **Transacciones ACID**: Integridad de datos en operaciones complejas

---

### **5. Módulo de Benchmarking - `backend/src/modules/benchmarking/`** 🔥

#### **`benchmarking.service.ts`**
```typescript
// ¿POR QUÉ ES IMPORTANTE?
// - CORAZÓN DEL SISTEMA DE ANÁLISIS
// - Recolecta métricas de rendimiento de la base de datos
// - Exporta datos a BigQuery para análisis avanzado
// - Genera snapshots periódicos automáticos
```

**¿Qué explicar?**
- **Métricas de Rendimiento**: Tiempo de ejecución de queries, uso de CPU, memoria
- **pg_stat_statements**: **¡TECNOLOGÍA CLAVE!** - Extension de PostgreSQL para análisis
- **BigQuery Integration**: Exportación a Google Cloud para análisis masivo
- **Snapshots Automáticos**: Programados cada 6 horas

#### **`auth/oauth-bigquery.service.ts`**
```typescript
// ¿POR QUÉ ES IMPORTANTE?
// - Maneja autenticación OAuth2 con Google Cloud
// - Gestiona tokens de acceso para BigQuery
// - Implementa refresh token automático
// - Permite acceso seguro a APIs de Google
```

**¿Qué explicar?**
- **OAuth 2.0 Flow**: Flujo completo de autenticación con Google
- **Token Management**: Access tokens y refresh tokens
- **Google Cloud APIs**: BigQuery, Google Cloud Storage
- **Security**: Almacenamiento seguro de credenciales

#### **`snapshots/snapshot.service.ts`**
```typescript
// ¿POR QUÉ ES IMPORTANTE?
// - Ejecuta snapshots de datos periódicos
// - Extrae métricas de pg_stat_statements
// - Prepara datos para exportación
// - Maneja errores y reintentos
```

**¿Qué explicar?**
- **Data Extraction**: Extracción de métricas de PostgreSQL
- **Data Transformation**: Limpieza y formateo de datos
- **Error Handling**: Manejo robusto de errores
- **Scheduling**: Ejecución programada con cron jobs

---

### **6. Módulo de Inventario - `backend/src/modules/inventory/`**

#### **`inventory.service.ts`**
```typescript
// ¿POR QUÉ ES IMPORTANTE?
// - Gestiona stock con método FIFO
// - Calcula costos de inventario
- Controla fechas de expiración
- Integra con ventas en tiempo real
```

**¿Qué explicar?**
- **FIFO (First In, First Out)**: Algoritmo de rotación de inventario
- **Cost Tracking**: Seguimiento de costos por lote
- **Expiration Control**: Control de fechas de caducidad
- **Real-time Integration**: Actualización automática con ventas

---

## 🗄️ **BASE DE DATOS - ESTRUCTURA Y OPTIMIZACIÓN**

### **7. Entidades Principales - `backend/src/modules/*/entities/`**

#### **`daily-sale.entity.ts`**
```typescript
// ¿POR QUÉ ES IMPORTANTE?
// - Entidad central del sistema de ventas
// - Almacena métricas calculadas automáticamente
// - Relaciona con usuarios y detalles de venta
// - Soporta análisis temporales
```

**¿Qué explicar?**
- **Campos Calculados**: `totalRevenue`, `profitMargin`, `breakEvenUnits`
- **Relaciones**: One-to-many con `SaleDetail`
- **Índices Optimizados**: Por fecha, usuario, estado
- **Timestamps**: `createdAt`, `closedAt` para análisis temporal

#### **`sale-detail.entity.ts`**
```typescript
// ¿POR QUÉ ES IMPORTANTE?
// - Detalle de cada producto vendido
- Almacena cantidades y costos unitarios
- Soporta tracking de mermas
- Base para análisis de productividad
```

**¿Qué explicar?**
- **Campos de Negocio**: `quantityPrepared`, `quantitySold`, `wasteReason`
- **Relaciones**: Many-to-one con `DailySale` y `Product`
- **Cálculos Automáticos**: `wasteCost`, `totalRevenue`
- **Auditoría**: `createdAt` para tracking de cambios

---

### **8. Migraciones de Base de Datos - `database/migrations/`**

#### **`1772591774953-CreateForecastMaterializedView.ts`**
```typescript
// ¿POR QUÉ ES IMPORTANTE?
// - Crea vistas materializadas para rendimiento
- Optimiza consultas de predicción
- Cache de resultados complejos
- Base para dashboard de analíticas
```

**¿Qué explicar?**
- **Materialized Views**: Cache de resultados de consultas complejas
- **Performance**: Mejora drástica de tiempos de respuesta
- **Refresh Strategy**: Actualización programada de vistas
- **Query Optimization**: Reducción de carga en base de datos

---

## 📊 **BENCHMARKING AVANZADO**

### **9. Consultas SQL Optimizadas - `database/migrations/V017__create_export_views.sql`**

```sql
-- ¿POR QUÉ ES IMPORTANTE?
-- Consultas complejas para exportación de métricas
-- Análisis de rendimiento de queries
-- Agregaciones temporales para tendencias
-- Base para reportes de benchmarking
```

**¿Qué explicar?**
- **Query Performance Analysis**: Análisis de tiempos de ejecución
- **Temporal Aggregations**: Agregaciones por período de tiempo
- **Index Usage**: Análisis de uso de índices para optimización
- **Export Views**: Vistas optimizadas para BigQuery

---

## 🔧 **CONFIGURACIÓN Y DEPLOY**

### **10. Variables de Entorno - `.env`**
```bash
# ¿POR QUÉ ES IMPORTANTE?
# - Configuración segura del sistema
# - Credenciales de base de datos
# - Keys de OAuth con Google
# - Configuración de BigQuery
```

**¿Qué explicar?**
- **Database Credentials**: Configuración segura de PostgreSQL
- **OAuth Configuration**: Client ID y secret de Google
- **BigQuery Settings**: Project ID y dataset para exportación
- **Security**: Separación de configuración de código

---

## 🎯 **PUNTOS CLAVE PARA DEFENSA**

### **1. Arquitectura de Benchmarking**
- **pg_stat_statements**: Extension PostgreSQL para análisis de queries
- **Materialized Views**: Cache de resultados para rendimiento
- **BigQuery Integration**: Análisis masivo en Google Cloud
- **OAuth 2.0**: Autenticación segura con Google APIs

### **2. Optimización de Base de Datos**
- **Índices Estratégicos**: Por consultas frecuentes
- **Vistas Materializadas**: Pre-cálculo de métricas complejas
- **Query Optimization**: Análisis y mejora de consultas lentas
- **Connection Pooling**: Gestión eficiente de conexiones

### **3. Métricas y Análisis**
- **Real-time Metrics**: Cálculo en tiempo real de KPIs
- **Historical Analysis**: Tendencias y patrones temporales
- **Performance Monitoring**: Monitoreo constante del sistema
- **Business Intelligence**: Dashboard con insights de negocio

### **4. Seguridad y Escalabilidad**
- **OAuth Integration**: Autenticación federada segura
- **Data Encryption**: Cifrado de datos sensibles
- **Microservices Architecture**: Escalabilidad horizontal
- **Health Monitoring**: Monitoreo continuo de servicios

---

## 🚀 **DEMO TÉCNICA RECOMENDADA**

### **1. Mostrar Sistema Funcionando**
```bash
# 1. Verificar todos los servicios healthy
docker compose ps

# 2. Probar API de benchmarking
curl http://localhost:3001/api/benchmarking/metrics

# 3. Mostrar vistas materializadas
docker exec database psql -U tienditacampus_user -d tienditacampus -c "\dvw+"

# 4. Probar OAuth con Google
# (Mostrar flujo completo en navegador)
```

### **2. Explicar Arquitectura**
- **Diagrama de flujo** de datos
- **Módulos y responsabilidades**
- **Integración con servicios externos**

### **3. Demostrar Benchmarking**
- **Ejecutar snapshot manual**
- **Mostrar métricas en tiempo real**
- **Exportar a BigQuery**
- **Analizar resultados**

---

## 📝 **RESPUESTAS A POSIBLES PREGUNTAS**

### **P: ¿Por qué TypeORM en lugar de SQL puro?**
**R:** TypeORM proporciona type safety, migraciones automáticas, y mejor mantenibilidad mientras permite SQL nativo para consultas complejas.

### **P: ¿Cómo manejan concurrencia en ventas?**
**R:** Usamos transacciones ACID de PostgreSQL con row-level locking para garantizar integridad en operaciones concurrentes.

### **P: ¿Por qué BigQuery para benchmarking?**
**R:** BigQuery permite análisis de petabytes de datos con SQL estándar, ideal para tendencias temporales y machine learning.

### **P: ¿Cómo optimizaron consultas lentas?**
**R:** Implementamos pg_stat_statements para identificar queries lentos, creamos índices específicos y vistas materializadas para cachear resultados.

### **P: ¿Qué pasa si falla la exportación a BigQuery?**
**R:** Implementamos retry automático con exponential backoff y fallback a almacenamiento local con reintentos posteriores.

---

## 🎓 **CONCLUSIÓN**

Este sistema demuestra **arquitectura enterprise** con:
- **Base de datos optimizada** con técnicas avanzadas
- **Benchmarking profesional** con herramientas cloud
- **Código limpio y mantenible** con patrones sólidos
- **Integración completa** con servicios externos
- **Monitoreo y salud** del sistema en tiempo real

**¡Listo para defensa técnica a nivel profesional!** 🚀
