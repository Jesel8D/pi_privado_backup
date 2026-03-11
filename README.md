# TienditaCampus Backend - Sistema de Gestión Cafetería

## 📋 Overview

Sistema completo de gestión para cafetería escolar con capacidades de benchmarking avanzado, análisis predictivo y exportación de datos a BigQuery.

## 🏗️ Arquitectura

### Core Modules
- **Auth**: Autenticación JWT con Google OAuth
- **Sales**: Gestión de ventas diarias, tracking y cierre de día
- **Products**: Catálogo de productos con control de inventario
- **Inventory**: Gestión de stock con método FIFO
- **Users**: Gestión de usuarios y roles
- **Audit**: Logging de auditoría completo
- **Benchmarking**: Análisis predictivo y métricas avanzadas

### Base de Datos
- **PostgreSQL**: Base principal con migraciones versionadas
- **MongoDB**: Logging de auditoría
- **pg_stat_statements**: Métricas de rendimiento de queries

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 16+
- MongoDB 7+

### Instalación
```bash
# Clonar repositorio
git clone <repo-url>
cd pi_privado_backup

# Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales

# Iniciar servicios
docker compose up -d

# Acceder API
http://localhost:3001/api
```

### Variables de Entorno
```bash
# Base de Datos
DATABASE_URL=postgresql://user:pass@localhost:5432/tiendita
MONGODB_URI=mongodb://localhost:27017/audit

# Autenticación
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Benchmarking
GCP_PROJECT_ID=your-project
BIGQUERY_DATASET=analytics
BIGQUERY_TABLE=benchmarks

# Aplicación
BACKEND_PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=production
```

## 📊 Módulos Principales

### Sales Module
Gestión completa del ciclo de ventas:

#### Funcionalidades
- **Inicialización diaria**: Preparación de productos para venta
- **Tracking en tiempo real**: Registro de ventas por producto
- **Cierre de día**: Calculo de métricas y consumo de inventario
- **Análisis predictivo**: Sugerencias basadas en histórico IQR

#### Endpoints Principales
```typescript
POST /api/sales/daily/initialize    // Iniciar día
POST /api/sales/daily/track        // Registrar venta
POST /api/sales/daily/close         // Cerrar día
GET  /api/sales/history            // Histórico de ventas
GET  /api/sales/roi               // Métricas ROI
```

#### Métricas Calculadas
- **ROI**: Return on Investment por período
- **Break-even**: Punto de equilibrio por día
- **Profit Margin**: Margen de utilidad
- **Waste Rate**: Porcentaje de merma
- **Revenue per Unit**: Ingreso por unidad vendida

### Benchmarking Module
Sistema avanzado de análisis y exportación:

#### Funcionalidades
- **OAuth BigQuery**: Autenticación segura con Google
- **Snapshot diario**: Exportación automática de métricas
- **Análisis predictivo**: Modelos estadísticos avanzados
- **Export views**: Vistas optimizadas para consultas

#### Endpoints
```typescript
GET  /api/benchmarking/metrics        // Métricas actuales
GET  /api/benchmarking/auth/google    // OAuth Google
POST /api/benchmarking/snapshots/execute  // Ejecutar snapshot
GET  /api/benchmarking/snapshots/export/:projectId  // Exportar datos
```

#### Vistas de Exportación
```sql
-- Productos más vendidos por período
CREATE VIEW top_products AS
SELECT p.name, SUM(sd.quantity_sold) as total_sold
FROM sale_details sd
JOIN products p ON sd.product_id = p.id
GROUP BY p.name
ORDER BY total_sold DESC;

-- Métricas de rendimiento por query
CREATE VIEW query_performance AS
SELECT query, calls, total_time, mean_time, rows
FROM pg_stat_statements
ORDER BY total_time DESC;
```

### Inventory Module
Gestión de inventario con método FIFO:

#### Funcionalidades
- **Control de stock**: Tracking en tiempo real
- **Consumo FIFO**: First-In-First-Out automático
- **Alertas de stock**: Notificaciones de bajo inventario
- **Integración ventas**: Consumo automático al cerrar día

#### Endpoints
```typescript
POST /api/inventory/add           // Agregar stock
GET  /api/inventory/current       // Stock actual
GET  /api/inventory/alerts       // Alertas de bajo stock
POST /api/inventory/consume       // Consumir manualmente
```

## 🔧 Configuración Avanzada

### pg_stat_statements
Para habilitar métricas de rendimiento:
```sql
-- En postgresql.conf
shared_preload_libraries = 'pg_stat_statements'
pg_stat_statements.track = 'all'
pg_stat_statements.max = 10000

-- Reiniciar PostgreSQL y crear extensión
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

### OAuth BigQuery Config
```typescript
// Configuración OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Scopes requeridos
const scopes = [
  'https://www.googleapis.com/auth/bigquery',
  'https://www.googleapis.com/auth/cloud-platform'
];
```

## 📈 Métricas y KPIs

### Sales KPIs
- **Daily Revenue**: Ingresos diarios
- **Average Ticket**: Ticket promedio
- **Product Mix**: Mix de productos vendidos
- **Peak Hours**: Horas pico de ventas
- **Waste Analysis**: Análisis de merma por producto

### Benchmarking KPIs
- **Query Performance**: Tiempo de ejecución por query
- **Database Load**: Carga en base de datos
- **API Response Time**: Tiempo de respuesta promedio
- **Error Rate**: Tasa de errores por endpoint
- **Concurrent Users**: Usuarios concurrentes pico

## 🔐 Seguridad

### Autenticación
- **JWT Tokens**: Tokens con expiración configurable
- **Google OAuth**: Integración con Google Workspace
- **Role-based Access**: Control por roles (admin, user, viewer)
- **Session Management**: Manejo seguro de sesiones

### Auditoría
- **Complete Logging**: Todas las acciones registradas
- **MongoDB Storage**: Logs en base separada
- **Immutable Records**: Registros de auditoría inmutables
- **Compliance**: Cumplimiento de normativas

## 🚀 Despliegue

### Producción
```bash
# Build optimizado
docker compose -f docker-compose.prod.yml up -d

# Health checks
curl http://localhost:3001/api/health

# Logs en tiempo real
docker compose logs -f backend
```

### Monitoreo
- **Health Checks**: Endpoint `/api/health`
- **Metrics**: Prometheus-compatible metrics
- **Logging**: Estructurado con Winston
- **Error Tracking**: Integración con servicios externos

## 🧪 Testing

### Unit Tests
```bash
# Ejecutar tests unitarios
npm run test

# Coverage
npm run test:cov
```

### Integration Tests
```bash
# Tests de integración
npm run test:e2e

# API Testing
npm run test:api
```

## 📚 Documentación API

### Autenticación
```typescript
// Login con Google
POST /api/auth/google
{
  "token": "google-oauth-token"
}

// Refresh token
POST /api/auth/refresh
{
  "refreshToken": "jwt-refresh-token"
}
```

### Sales Operations
```typescript
// Inicializar día
POST /api/sales/daily/initialize
{
  "items": [
    {
      "productId": "prod-123",
      "quantityPrepared": 50
    }
  ]
}

// Registrar venta
POST /api/sales/daily/track
{
  "productId": "prod-123",
  "quantitySold": 5,
  "unitPrice": 25.50
}

// Cerrar día
POST /api/sales/daily/close
{
  "wastes": [
    {
      "productId": "prod-123",
      "waste": 3,
      "wasteReason": "expired"
    }
  ]
}
```

## 🔍 Troubleshooting

### Issues Comunes
1. **Backend no inicia**: Verificar variables de entorno en `.env`
2. **Database connection**: Revisar `DATABASE_URL` y credenciales
3. **OAuth errors**: Configurar `GOOGLE_CLIENT_ID` y redirect URI
4. **Benchmarking fails**: Verificar permisos BigQuery y GCP project

### Health Checks
```bash
# Verificar estado general
curl http://localhost:3001/api/health

# Verificar módulos específicos
curl http://localhost:3001/api/sales/health
curl http://localhost:3001/api/benchmarking/health
```

## 📞 Soporte

### Contacto
- **Development Team**: dev@tienditacampus.com
- **Documentation**: docs@tienditacampus.com
- **Issues**: GitHub Issues

### Licencia
MIT License - Ver archivo LICENSE para detalles completos.
