# 🎓 DEFENSA COMPLETA - TIENDITACAMPUS

## 🎯 **ENFOQUE PRINCIPAL: BENCHMARKING Y BASE DE DATOS**

---

## 🚀 **INTRODUCCIÓN**

**TienditaCampus** es una plataforma **enterprise-grade** para vendedores universitarios que implementa **técnicas avanzadas de benchmarking** y **optimización de base de datos** para garantizar rendimiento escalable y análisis de datos en tiempo real.

### 🔥 **CARACTERÍSTICAS TÉCNICAS PRINCIPALES:**

1. **Sistema de Benchmarking con Google Cloud Platform**
2. **Análisis de Rendimiento con pg_stat_statements**
3. **Vistas Materializadas para Optimización**
4. **Exportación Automática a BigQuery**
5. **Predicciones con Método IQR**
6. **Monitoreo Continuo con Health Checks**

---

## 🏗️ **ARQUITECTURA TÉCNICA**

### **📊 Capa de Datos (PostgreSQL 16)**
```
├── pg_stat_statements (Extension de PostgreSQL)
├── Vistas Materializadas (Cache de consultas)
├── Índices Estratégicos (Optimización de queries)
└── Transacciones ACID (Integridad de datos)
```

### **⚡ Capa de Análisis (Benchmarking)**
```
├── Recolector de Métricas (pg_stat_statements)
├── Procesador de Snapshots (Automatización)
├── Exportador a BigQuery (Google Cloud)
└── Analizador de Tendencias (Machine Learning)
```

### **🔧 Capa de Negocio (NestJS)**
```
├── Módulo de Ventas (Lógica de negocio)
├── Módulo de Inventario (FIFO, costos)
├── Módulo de Benchmarking (Análisis)
└── Módulo de Autenticación (OAuth 2.0)
```

---

## 🔥 **SISTEMA DE BENCHMARKING - CORAZÓN DEL PROYECTO**

### **📈 ¿QUÉ ES BENCHMARKING AQUÍ?**

**Es el sistema que mide, analiza y optimiza el rendimiento de la base de datos y las consultas SQL en tiempo real.**

### **🛠️ COMPONENTES CLAVE:**

#### **1. pg_stat_statements**
```sql
-- Extension de PostgreSQL que recolecta estadísticas
CREATE EXTENSION pg_stat_statements;

-- Consulta para analizar queries lentas
SELECT query, calls, total_time, mean_time, rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

**¿Por qué es importante?**
- **Identifica queries lentas** automáticamente
- **Mide tiempo de ejecución** de cada consulta
- **Optimiza rendimiento** basado en datos reales

#### **2. Vistas Materializadas**
```sql
-- Cache de resultados complejos
CREATE MATERIALIZED VIEW vw_product_performance AS
SELECT 
    p.id,
    p.name,
    SUM(sd.quantity_sold) as total_sold,
    AVG(sd.unit_price) as avg_price,
    -- 50+ métricas más
FROM products p
JOIN sale_details sd ON p.id = sd.product_id
GROUP BY p.id, p.name;

-- Refresco automático cada 6 horas
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW vw_product_performance;
    -- Refrescar otras vistas...
END;
$$ LANGUAGE plpgsql;
```

**¿Por qué es importante?**
- **Cache de resultados** complejos
- **Reduce carga** en base de datos
- **Mejora tiempos** de respuesta drásticamente

#### **3. Exportación a BigQuery**
```typescript
// Servicio de exportación automática
export class BigQueryExportService {
    async exportMetrics() {
        const metrics = await this.collectMetrics();
        
        // Transformar datos para BigQuery
        const transformed = this.transformForBigQuery(metrics);
        
        // Exportar a Google Cloud
        await this.bigQuery.dataset('benchmarking_warehouse')
            .table('daily_query_metrics')
            .insert(transformed);
    }
}
```

**¿Por qué es importante?**
- **Análisis masivo** de datos históricos
- **Machine Learning** con Google Cloud AI
- **Escalabilidad ilimitada** para análisis

---

## 🗄️ **BASE DE DATOS - DISEÑO Y OPTIMIZACIÓN**

### **📋 Esquema Relacional Optimizado**

#### **Entidades Principales:**

**1. DailySale (Ventas Diarias)**
```typescript
@Entity('daily_sales')
export class DailySale {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalRevenue: number;      // Ingresos totales
    
    @Column({ type: 'decimal', precision: 5, scale: 2 })
    profitMargin: number;      // Margen de ganancia
    
    @Column({ type: 'integer' })
    breakEvenUnits: number;    // Unidades punto de equilibrio
    
    // Relaciones y timestamps...
}
```

**¿Por qué este diseño?**
- **Métricas calculadas** automáticamente
- **Análisis temporal** por fechas
- **Relaciones optimizadas** con índices

**2. SaleDetail (Detalles de Venta)**
```typescript
@Entity('sale_details')
export class SaleDetail {
    @Column({ type: 'integer' })
    quantityPrepared: number;   // Cantidad preparada
    
    @Column({ type: 'integer' })
    quantitySold: number;       // Cantidad vendida
    
    @Column({ type: 'text', nullable: true })
    wasteReason: string;        // Razón de merma
    
    // Cálculos automáticos...
    get wasteCost(): number {
        const waste = this.quantityPrepared - this.quantitySold;
        return waste * this.unitCost;
    }
}
```

**¿Por qué este diseño?**
- **Control de mermas** para optimización
- **Cálculos automáticos** de costos
- **Auditoría completa** de operaciones

### **🚀 Optimización de Consultas**

#### **Índices Estratégicos**
```sql
-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_daily_sales_user_date 
ON daily_sales(user_id, sale_date DESC);

CREATE INDEX idx_sale_details_product_performance 
ON sale_details(product_id, sale_date, quantity_sold);

-- Índices parciales para datos activos
CREATE INDEX idx_active_products 
ON products(is_active, category) 
WHERE is_active = true;
```

#### **Consultas Optimizadas**
```sql
-- Análisis de rendimiento de productos
WITH product_metrics AS (
    SELECT 
        p.id,
        p.name,
        p.category,
        SUM(sd.quantity_sold) as total_sold,
        SUM(sd.total_revenue) as revenue,
        AVG(sd.profit_margin) as avg_margin,
        -- Cálculo de percentiles para predicciones
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY sd.quantity_sold) as p75_sales
    FROM products p
    JOIN sale_details sd ON p.id = sd.product_id
    WHERE sd.sale_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY p.id, p.name, p.category
)
SELECT * FROM product_metrics
WHERE revenue > (SELECT AVG(revenue) * 1.5 FROM product_metrics);
```

---

## 🤖 **INTELIGENCIA ARTIFICIAL Y PREDICCIONES**

### **📊 Método IQR para Predicciones**

```typescript
// Algoritmo de predicción basado en rango intercuartílico
calculatePredictions(salesData: SaleData[]): Prediction[] {
    const sorted = salesData.sort((a, b) => a.units - b.units);
    
    // Calcular cuartiles
    const q1 = this.percentile(sorted, 0.25);
    const q3 = this.percentile(sorted, 0.75);
    const iqr = q3 - q1;
    
    // Identificar outliers y predecir
    const outliers = sorted.filter(sale => 
        sale.units < (q1 - 1.5 * iqr) || 
        sale.units > (q3 + 1.5 * iqr)
    );
    
    return this.generatePredictions(outliers, iqr);
}
```

**¿Por qué IQR?**
- **Robusto ante outliers** (ventas atípicas)
- **Basado en estadística** sólida
- **Adaptable** a diferentes productos

---

## 🔐 **SEGURIDAD Y AUTENTICACIÓN**

### **🔑 OAuth 2.0 con Google Cloud**

```typescript
// Flujo completo de autenticación
export class OAuthBigQueryService {
    async getAuthUrl(): Promise<string> {
        const url = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/bigquery',
                'https://www.googleapis.com/auth/cloud-platform'
            ],
            redirect_uri: 'http://localhost:8080/api/benchmarking/auth/callback'
        });
        return url;
    }
    
    async exchangeCodeForTokens(code: string) {
        const { tokens } = await this.oauth2Client.getToken(code);
        this.oauth2Client.setCredentials(tokens);
        
        // Guardar tokens de forma segura
        await this.saveTokens(tokens);
    }
}
```

**¿Por qué OAuth 2.0?**
- **Seguridad enterprise** estándar
- **Sin credenciales** en el código
- **Refresh tokens** para acceso continuo
- **Integración** con Google Cloud

---

## 📈 **MÉTRICAS Y MONITOREO**

### **🎯 KPIs Principales**

#### **1. Métricas de Rendimiento**
```typescript
interface PerformanceMetrics {
    queryTime: number;           // Tiempo promedio de queries
    slowQueries: number;         // Queries lentas (>100ms)
    cacheHitRate: number;       // Tasa de cache hits
    connectionPool: number;      // Conexiones activas
    cpuUsage: number;           // Uso de CPU
    memoryUsage: number;         // Uso de memoria
}
```

#### **2. Métricas de Negocio**
```typescript
interface BusinessMetrics {
    dailyRevenue: number;        // Ingresos diarios
    profitMargin: number;       // Margen de ganancia
    wastePercentage: number;     // Porcentaje de merma
    inventoryTurnover: number;   // Rotación de inventario
    breakEvenDays: number;      // Días para punto de equilibrio
}
```

### **📊 Dashboard de Analíticas**

**Panel en tiempo real que muestra:**
- **Rendimiento de base de datos** (queries lentas, cache hits)
- **Métricas de negocio** (ingresos, márgenes, predicciones)
- **Tendencias temporales** (ventas por día, semana, mes)
- **Alertas automáticas** (productos con bajo rendimiento)

---

## 🚀 **IMPLEMENTACIÓN TÉCNICA**

### **🛠️ Stack Tecnológico**

| Capa | Tecnología | Propósito |
|-------|------------|------------|
| **Frontend** | Next.js 14 | PWA progresiva con SSR |
| **Backend** | NestJS | API REST enterprise con TypeScript |
| **Base de Datos** | PostgreSQL 16 | Base de datos relacional con pg_stat_statements |
| **Cache** | Vistas Materializadas | Cache de consultas complejas |
| **Cloud** | Google Cloud Platform | BigQuery, OAuth 2.0, Storage |
| **Contenedores** | Docker | Orquestación con Docker Compose |
| **Proxy** | Nginx | Balanceador y reverse proxy |

### **🔧 Configuración de Producción**

```yaml
# docker-compose.yml - Configuración enterprise
version: '3.8'
services:
  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - POSTGRES_HOST=database
      - BIGQUERY_PROJECT_ID=data-from-software
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3001/api/health"]
      interval: 30s
      retries: 5
    
  database:
    image: postgres:16
    environment:
      - POSTGRES_DB=tienditacampus
      - POSTGRES_USER=tienditacampus_user
    command: ["postgres", "-c", "shared_preload_libraries=pg_stat_statements"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tienditacampus_user"]
      interval: 10s
```

---

## 🎯 **DEMO TÉCNICA**

### **📋 Pasos para Demostrar el Sistema**

#### **1. Verificar Sistema Funcionando**
```bash
# Verificar todos los servicios healthy
docker compose ps

# Debe mostrar:
# ✅ database: healthy
# ✅ backend: healthy  
# ✅ frontend: running
# ✅ mongodb: healthy
# ✅ nginx: healthy
```

#### **2. Probar API de Benchmarking**
```bash
# Obtener métricas de rendimiento
curl http://localhost:3001/api/benchmarking/metrics

# Respuesta esperada:
{
  "queryTime": 45.2,
  "slowQueries": 3,
  "cacheHitRate": 0.87,
  "lastSnapshot": "2026-03-11T06:00:00Z"
}
```

#### **3. Verificar Vistas Materializadas**
```bash
# Conectar a base de datos
docker exec database psql -U tienditacampus_user -d tienditacampus

# Listar vistas materializadas
\dmv

# Ver contenido de vista de rendimiento
SELECT * FROM vw_product_performance LIMIT 5;
```

#### **4. Probar OAuth con Google**
```bash
# Obtener URL de autenticación
curl http://localhost:3001/api/benchmarking/auth/google

# Visitar URL en navegador para flujo OAuth completo
# Redirigirá a: http://localhost:8080/api/benchmarking/auth/callback
```

#### **5. Demostrar Predicciones**
```bash
# Generar predicciones para productos
curl -X POST http://localhost:3001/api/forecast/123/day/1

# Respuesta esperada:
{
  "productId": 123,
  "dayOfWeek": 1,
  "predictedSales": 15,
  "confidence": 0.85,
  "method": "IQR"
}
```

---

## 🎓 **PREGUNTAS FRECUENTES Y RESPUESTAS**

### **❓ P: ¿Por qué PostgreSQL en lugar de MongoDB?**
**R:** PostgreSQL ofrece **ACID transaccional**, **pg_stat_statements** para benchmarking, **vistas materializadas** nativas, y **mejor rendimiento** para consultas analíticas complejas.

### **❓ P: ¿Qué es pg_stat_statements y por qué es crucial?**
**R:** Es una extensión de PostgreSQL que **recolecta estadísticas de ejecución** de todas las queries. Es **crucial** porque permite:
- Identificar consultas lentas automáticamente
- Medir impacto de optimizaciones
- Basar decisiones en datos reales

### **❓ P: ¿Por qué BigQuery para análisis?**
**R:** BigQuery permite **análisis de petabytes** con SQL estándar, **escalabilidad infinita**, y **integración con Google Cloud AI** para machine learning avanzado.

### **❓ P: ¿Cómo manejan concurrencia en ventas?**
**R:** Usamos **transacciones ACID** de PostgreSQL con **row-level locking** y **optimistic concurrency control** para garantizar integridad en operaciones concurrentes.

### **❓ P: ¿Qué pasa si falla la exportación a BigQuery?**
**R:** Implementamos **retry automático** con **exponential backoff**, **fallback a almacenamiento local**, y **reintentos programados** cada 30 minutos.

### **❓ P: ¿Por qué vistas materializadas?**
**R:** **Cache persistente** de resultados complejos que **reduce carga** en base de datos y **mejora tiempos** de respuesta de segundos a milisegundos.

---

## 🏆 **VENTAJAS COMPETITIVAS**

### **🚀 Innovación Tecnológica**
- **Benchmarking automático** con pg_stat_statements
- **Integración cloud** con Google BigQuery
- **Predicciones estadísticas** con método IQR
- **Monitoreo enterprise** en tiempo real

### **⚡ Optimización de Rendimiento**
- **Vistas materializadas** para cache persistente
- **Índices estratégicos** para consultas frecuentes
- **Connection pooling** para escalabilidad
- **Health checks** automáticos

### **🔒 Seguridad Enterprise**
- **OAuth 2.0** estándar de la industria
- **Variables de entorno** sin credenciales en código
- **Roles PostgreSQL** separados por privilegios
- **Cifrado** de datos sensibles

---

## 🎯 **CONCLUSIÓN**

**TienditaCampus** representa una **solución enterprise-grade** que combina:

- **Base de datos optimizada** con técnicas avanzadas
- **Sistema de benchmarking** completo y automático
- **Integración cloud** con Google Platform
- **Análisis predictivo** con algoritmos estadísticos
- **Arquitectura escalable** y mantenible

El sistema no solo resuelve el problema de negocio de los vendedores universitarios, sino que también **demuestra capacidades técnicas avanzadas** en optimización de base de datos, análisis de rendimiento, y arquitectura de software a nivel profesional.

**¡Un proyecto listo para producción y escalabilidad empresarial!** 🚀

---

## 📞 **CONTACTO Y DEMO**

**Para una demo en vivo:**
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001/api
- **Documentación**: `/docs` en el repositorio

**Autor:** Jesel8D - Universidad Politécnica de Chiapas  
**Proyecto:** TienditaCampus - Herramientas Digitales para Vendedores Universitarios
