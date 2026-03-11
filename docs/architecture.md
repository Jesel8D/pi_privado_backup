# Arquitectura del Sistema

## 🏗️ Overview General

TienditaCampus implementa una arquitectura de microservicios altamente escalable con separación clara de responsabilidades y capacidades de benchmarking avanzado.

## 📊 Diagrama de Arquitectura

```mermaid
graph TB
    subgraph "Frontend Layer"
        WEB[Next.js PWA]
        MOBILE[Mobile App]
    end
    
    subgraph "API Gateway"
        NGINX[Nginx Proxy]
    end
    
    subgraph "Backend Services"
        API[NestJS Backend]
        AUTH[Auth Service]
        SALES[Sales Service]
        BENCH[Benchmarking Service]
        INV[Inventory Service]
    end
    
    subgraph "Data Layer"
        PG[(PostgreSQL)]
        MONGO[(MongoDB)]
        BQ[BigQuery]
    end
    
    subgraph "External Services"
        GOOGLE[Google OAuth]
        GCP[Google Cloud Platform]
    end
    
    WEB --> NGINX
    MOBILE --> NGINX
    NGINX --> API
    
    API --> AUTH
    API --> SALES
    API --> BENCH
    API --> INV
    
    AUTH --> PG
    SALES --> PG
    INV --> PG
    BENCH --> PG
    
    AUTH --> MONGO
    API --> MONGO
    
    BENCH --> GOOGLE
    BENCH --> BQ
    GOOGLE --> GCP
    
    classDef backend fill:#e1f5fe
    class API,AUTH,SALES,BENCH,INV backend
```

## 🔧 Componentes Principales

### 1. Frontend (Next.js 14 PWA)
- **Progressive Web App**: Experiencia nativa en navegador
- **Server-Side Rendering**: Optimización SEO y rendimiento
- **Real-time Updates**: WebSocket integration
- **Offline Support**: Service Workers para modo offline

### 2. Backend (NestJS)
- **TypeScript**: Tipado estricto para robustez
- **Modular Architecture**: Desacoplamiento por dominios
- **Dependency Injection**: Inversión de control
- **Middleware Pipeline**: Validación, autenticación, logging

### 3. Base de Datos Principal (PostgreSQL 16)
- **ACID Compliance**: Integridad transaccional
- **JSONB Support**: Datos flexibles y estructurados
- **pg_stat_statements**: Métricas de rendimiento
- **Partitioning**: Escalabilidad horizontal

### 4. Auditoría (MongoDB)
- **Document Storage**: Esquema flexible para logs
- **Time Series**: Optimizado para datos temporales
- **Replica Set**: Alta disponibilidad
- **Aggregation Pipeline**: Análisis en tiempo real

## 📋 Módulos de Negocio

### Auth Module
```typescript
@Module({
  imports: [JwtModule, PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleOAuthService],
  exports: [AuthService],
})
```

**Responsabilidades:**
- Autenticación JWT con refresh tokens
- OAuth2 con Google Workspace
- Validación de usuarios y roles
- Session management seguro

### Sales Module
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([DailySale, SaleDetail]), InventoryModule],
  controllers: [SalesController],
  providers: [SalesService, SalesRepository, CreateDailySaleUseCase],
  exports: [SalesService],
})
```

**Responsabilidades:**
- Ciclo completo de ventas diarias
- Cálculo de métricas en tiempo real
- Integración con inventario FIFO
- Análisis predictivo IQR

### Benchmarking Module
```typescript
@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [BenchmarkingController],
  providers: [BenchmarkingService, OAuthBigQueryService, SnapshotService],
  exports: [BenchmarkingService],
})
```

**Responsabilidades:**
- Exportación automática a BigQuery
- Análisis de rendimiento de queries
- Métricas de uso del sistema
- OAuth con Google Cloud

## 🗄️ Flujo de Datos

### 1. Flujo de Ventas
```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as API
    participant S as Sales Service
    participant I as Inventory Service
    participant P as PostgreSQL
    
    U->>F: Inicializar día
    F->>A: POST /api/sales/daily/initialize
    A->>S: CreateDailySaleUseCase.execute()
    S->>I: Verificar stock disponible
    I->>P: SELECT units FROM inventory
    S->>P: INSERT daily_sale
    S->>P: INSERT sale_details
    P-->>S: Sale creada
    S-->>A: Response con sale ID
    A-->>F: Daily sale inicializada
    F-->>U: Confirmación
    
    U->>F: Registrar venta
    F->>A: POST /api/sales/daily/track
    A->>S: TrackSaleUseCase.execute()
    S->>P: UPDATE sale_details
    S-->>A: Venta registrada
    A-->>F: Confirmación
    F-->>U: Venta actualizada
    
    U->>F: Cerrar día
    F->>A: POST /api/sales/daily/close
    A->>S: CloseDayUseCase.execute()
    S->>I: Consumir inventario FIFO
    S->>P: UPDATE daily_sale (metrics)
    P-->>S: Día cerrado
    S-->>A: Métricas calculadas
    A-->>F: Resumen del día
    F-->>U: Reporte completo
```

### 2. Flujo de Benchmarking
```mermaid
sequenceDiagram
    participant S as Scheduler
    participant B as Benchmarking Service
    participant O as OAuth Service
    participant G as Google Cloud
    participant Q as BigQuery
    
    Note over S: Daily at 2:00 AM
    S->>B: Execute snapshot
    B->>O: getAccessToken()
    O->>G: OAuth2 flow
    G-->>O: Access token
    O-->>B: Token válido
    
    B->>B: collectMetrics()
    Note over B: - Query performance<br/>- Database stats<br/>- API metrics
    
    B->>Q: INSERT metrics
    Q-->>B: Confirmación
    
    B->>B: createExportViews()
    Note over B: - Materialized views<br/>- Aggregated tables
    
    B-->>S: Snapshot completado
```

## 🔐 Arquitectura de Seguridad

### 1. Capas de Seguridad
```mermaid
graph TB
    subgraph "Network Security"
        HTTPS[SSL/TLS]
        CORS[CORS Policy]
        RATE[Rate Limiting]
    end
    
    subgraph "Application Security"
        JWT[JWT Authentication]
        RBAC[Role-Based Access]
        VALID[Input Validation]
        SANITIZE[Data Sanitization]
    end
    
    subgraph "Data Security"
        ENCRYPT[Encryption at Rest]
        AUDIT[Audit Logging]
        BACKUP[Regular Backups]
        PII[PII Protection]
    end
    
    HTTPS --> JWT
    CORS --> RBAC
    RATE --> VALID
    JWT --> ENCRYPT
    RBAC --> AUDIT
    VALID --> BACKUP
```

### 2. Gestión de Identidad
- **JWT Access Tokens**: 15 minutos de validez
- **JWT Refresh Tokens**: 7 días de validez
- **Google OAuth**: Integración SSO
- **Role Hierarchy**: Admin > User > Viewer

### 3. Auditoría Completa
```typescript
interface AuditLog {
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  ip: string;
  userAgent: string;
  result: 'success' | 'failure';
  details?: Record<string, any>;
}
```

## 📈 Métricas y Monitoring

### 1. Application Metrics
- **Response Time**: P50, P95, P99
- **Throughput**: Requests per second
- **Error Rate**: Percentage por endpoint
- **Concurrent Users**: Active sessions

### 2. Database Metrics
```sql
-- Query performance analysis
SELECT 
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  stddev_exec_time,
  rows,
  100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements 
ORDER BY total_exec_time DESC 
LIMIT 20;
```

### 3. Business Metrics
- **Daily Revenue**: Ingresos por día
- **Average Order Value**: Ticket promedio
- **Product Velocity**: Rotación de inventario
- **Waste Percentage**: Merma por producto

## 🚀 Escalabilidad

### 1. Horizontal Scaling
- **Load Balancer**: Nginx con múltiples backends
- **Database Replication**: Master-slave PostgreSQL
- **Caching Layer**: Redis para sesiones y caché
- **CDN**: Static assets distribuidos

### 2. Vertical Scaling
- **Resource Monitoring**: CPU, Memory, I/O
- **Auto-scaling**: Basado en métricas de carga
- **Connection Pooling**: PgBouncer para PostgreSQL
- **Index Optimization**: Queries optimizadas

## 🔧 Configuración de Entorno

### Development
```yaml
# docker-compose.dev.yml
services:
  backend:
    build:
      context: ./backend
      target: development
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DEBUG=app:*
```

### Production
```yaml
# docker-compose.prod.yml
services:
  backend:
    image: tienditacampus/backend:latest
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
    environment:
      - NODE_ENV=production
```

## 📦 Deployment Pipeline

### CI/CD Flow
```mermaid
graph LR
    DEV[Development] --> TEST[Automated Tests]
    TEST --> BUILD[Build Image]
    BUILD --> STAGE[Staging Deploy]
    STAGE --> E2E[E2E Tests]
    E2E --> PROD[Production Deploy]
    
    style DEV fill:#e1f5fe
    style PROD fill:#4caf50
```

### Quality Gates
- **Unit Tests**: >80% coverage
- **Integration Tests**: All critical paths
- **Security Scan**: No vulnerabilities
- **Performance**: Response time <200ms

## 🔄 Disaster Recovery

### 1. Backup Strategy
- **Database Backups**: Daily full + hourly WAL
- **MongoDB Snapshots**: Every 6 hours
- **Code Repositories**: Git with multiple remotes
- **Configuration**: Infrastructure as Code

### 2. Recovery Procedures
- **RTO**: 4 horas (Recovery Time Objective)
- **RPO**: 1 hora (Recovery Point Objective)
- **Failover**: Manual trigger available
- **Rollback**: Previous version deployment

Esta arquitectura asegura alta disponibilidad, escalabilidad y mantenibilidad del sistema TienditaCampus.
