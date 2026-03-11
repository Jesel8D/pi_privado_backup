# API Reference - TienditaCampus Backend

## 🌐 Base URL
```
Production: https://api.tienditacampus.com/api
Development: http://localhost:3001/api
```

## 🔐 Autenticación

### Login con Google OAuth
```http
POST /auth/google
Content-Type: application/json

{
  "token": "google-oauth-id-token"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-uuid",
    "email": "user@upiicsa.edu.mx",
    "name": "Juan Pérez",
    "role": "user"
  },
  "expiresIn": 900
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {accessToken}
```

## 📊 Sales Module

### Inicializar Día de Ventas
```http
POST /sales/daily/initialize
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "items": [
    {
      "productId": "prod-123",
      "quantityPrepared": 50
    },
    {
      "productId": "prod-456", 
      "quantityPrepared": 30
    }
  ]
}
```

**Response:**
```json
{
  "id": "daily-sale-uuid",
  "sellerId": "user-uuid",
  "saleDate": "2024-03-11",
  "totalInvestment": 1250.00,
  "details": [
    {
      "id": "detail-uuid",
      "productId": "prod-123",
      "quantityPrepared": 50,
      "unitCost": 15.00,
      "unitPrice": 25.00
    }
  ],
  "isClosed": false,
  "createdAt": "2024-03-11T08:00:00Z"
}
```

### Registrar Venta
```http
POST /sales/daily/track
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "productId": "prod-123",
  "quantitySold": 5,
  "unitPrice": 25.50
}
```

**Response:**
```json
{
  "detail": {
    "id": "detail-uuid",
    "quantitySold": 5,
    "quantityPrepared": 50,
    "unitPrice": 25.50,
    "totalRevenue": 127.50
  },
  "dailySale": {
    "totalRevenue": 127.50,
    "unitsSold": 5
  }
}
```

### Cerrar Día de Ventas
```http
POST /sales/daily/close
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "wastes": [
    {
      "productId": "prod-123",
      "waste": 3,
      "wasteReason": "expired"
    },
    {
      "productId": "prod-456",
      "waste": 2, 
      "wasteReason": "damaged"
    }
  ]
}
```

**Response:**
```json
{
  "id": "daily-sale-uuid",
  "totalRevenue": 1250.00,
  "totalInvestment": 1250.00,
  "totalWasteCost": 75.00,
  "profitMargin": 0.00,
  "unitsSold": 45,
  "unitsLost": 5,
  "breakEvenUnits": 50.00,
  "isClosed": true,
  "closedAt": "2024-03-11T18:00:00Z"
}
```

### Historial de Ventas
```http
GET /sales/history?startDate=2024-03-01&endDate=2024-03-31
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "sales": [
    {
      "id": "sale-uuid",
      "saleDate": "2024-03-10",
      "totalRevenue": 1450.00,
      "profitMargin": 15.5,
      "unitsSold": 58,
      "isClosed": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 30,
    "total": 25,
    "totalPages": 1
  }
}
```

### Métricas ROI
```http
GET /sales/roi?startDate=2024-03-01&endDate=2024-03-31
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "investment": 12500.00,
  "revenue": 14375.00,
  "netProfit": 1875.00,
  "roi": 15.00,
  "period": {
    "startDate": "2024-03-01",
    "endDate": "2024-03-31"
  }
}
```

### Predicción de Ventas (IQR)
```http
GET /sales/prediction
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "productId": "prod-123",
  "productName": "Café Americano",
  "suggested": 45,
  "confidence": 0.85,
  "basedOn": "historical sales analysis (IQR method)",
  "weekday": "lunes"
}
```

## 📦 Inventory Module

### Agregar Stock
```http
POST /inventory/add
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "productId": "prod-123",
  "quantity": 100,
  "unitCost": 12.50,
  "expirationDate": "2024-04-15",
  "supplier": "Distribuidora ABC"
}
```

### Stock Actual
```http
GET /inventory/current
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "products": [
    {
      "id": "prod-123",
      "name": "Café Americano",
      "currentStock": 75,
      "unitCost": 12.50,
      "lastUpdated": "2024-03-11T10:30:00Z",
      "status": "normal"
    }
  ],
  "summary": {
    "totalProducts": 15,
    "lowStockProducts": 2,
    "outOfStockProducts": 0
  }
}
```

### Alertas de Stock
```http
GET /inventory/alerts
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "alerts": [
    {
      "productId": "prod-456",
      "productName": "Pan Dulce",
      "currentStock": 5,
      "minThreshold": 10,
      "severity": "high",
      "recommendedAction": "Reorder immediately"
    }
  ]
}
```

## 📈 Benchmarking Module

### Obtener Métricas Actuales
```http
GET /benchmarking/metrics
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "system": {
    "uptime": 86400,
    "memoryUsage": 65.2,
    "cpuUsage": 42.8
  },
  "database": {
    "avgQueryTime": 45.2,
    "slowQueries": 3,
    "connections": 25
  },
  "api": {
    "avgResponseTime": 125.5,
    "requestsPerSecond": 15.2,
    "errorRate": 0.02
  },
  "business": {
    "activeUsers": 150,
    "dailyRevenue": 2850.00,
    "ordersPerHour": 12.5
  }
}
```

### Iniciar OAuth con Google
```http
GET /benchmarking/auth/google
```

**Response:** Redirect a Google OAuth consent screen

```
https://accounts.google.com/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=http://localhost:3000/benchmarking/auth/callback&
  response_type=code&
  scope=https://www.googleapis.com/auth/bigquery+https://www.googleapis.com/auth/cloud-platform&
  state=random-state-string
```

### Callback OAuth
```http
GET /benchmarking/auth/callback?code=AUTH_CODE&state=STATE
```

**Response:** Redirect con access token

### Ejecutar Snapshot
```http
POST /benchmarking/snapshots/execute
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "projectId": 2,
  "includeQueries": true,
  "includeMetrics": true,
  "date": "2024-03-11"
}
```

**Response:**
```json
{
  "snapshotId": "snap-uuid",
  "status": "executing",
  "projectId": 2,
  "executedAt": "2024-03-11T02:00:00Z",
  "estimatedCompletion": "2024-03-11T02:05:00Z"
}
```

### Exportar Datos a BigQuery
```http
GET /benchmarking/snapshots/export/2
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "exportUrl": "https://storage.googleapis.com/tiendita-exports/snapshot-2024-03-11.csv",
  "format": "csv",
  "size": "2.5MB",
  "expiresAt": "2024-03-18T02:00:00Z",
  "tables": [
    {
      "name": "daily_sales",
      "rows": 365,
      "columns": ["id", "sale_date", "total_revenue", "profit_margin"]
    },
    {
      "name": "query_performance", 
      "rows": 50,
      "columns": ["query", "calls", "total_time", "mean_time"]
    }
  ]
}
```

## 🏷️ Products Module

### Listar Productos
```http
GET /products?page=1&limit=20&category=bebidas
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "products": [
    {
      "id": "prod-123",
      "name": "Café Americano",
      "description": "Café de origen único",
      "category": "bebidas",
      "unitCost": 12.50,
      "salePrice": 25.00,
      "currentStock": 75,
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### Crear Producto
```http
POST /products
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Latte Vainilla",
  "description": "Café con leche y vainilla",
  "category": "bebidas",
  "unitCost": 15.00,
  "salePrice": 35.00,
  "minStock": 10,
  "isActive": true
}
```

## 👥 Users Module

### Perfil de Usuario
```http
GET /users/profile
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "id": "user-uuid",
  "email": "user@upiicsa.edu.mx",
  "name": "Juan Pérez López",
  "role": "user",
  "isActive": true,
  "createdAt": "2024-01-10T12:00:00Z",
  "lastLogin": "2024-03-11T08:15:00Z",
  "preferences": {
    "language": "es",
    "timezone": "America/Mexico_City",
    "notifications": true
  }
}
```

### Actualizar Perfil
```http
PATCH /users/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Juan Pérez López",
  "preferences": {
    "language": "es",
    "notifications": false
  }
}
```

## 🔍 Health Checks

### Health General del Sistema
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-03-11T12:00:00Z",
  "uptime": 259200,
  "version": "1.0.0",
  "checks": {
    "database": "healthy",
    "mongodb": "healthy",
    "redis": "healthy"
  }
}
```

## ❌ Errores Comunes

### Authentication Errors
```json
{
  "error": "INVALID_TOKEN",
  "message": "El token proporcionado no es válido o ha expirado",
  "statusCode": 401
}
```

### Validation Errors
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Datos de entrada inválidos",
  "details": [
    {
      "field": "quantityPrepared",
      "message": "Debe ser un número positivo"
    }
  ],
  "statusCode": 400
}
```

### Business Logic Errors
```json
{
  "error": "BUSINESS_RULE_VIOLATION",
  "message": "No existe venta abierta para hoy",
  "statusCode": 422
}
```

## 📝 Headers Importantes

### Authorization Header
```http
Authorization: Bearer {accessToken}
```

### Content-Type
```http
Content-Type: application/json
```

### Rate Limiting
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1646990400
```

## 🔄 Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no existe |
| 422 | Unprocessable Entity - Error de lógica de negocio |
| 429 | Too Many Requests - Límite excedido |
| 500 | Internal Server Error - Error del servidor |

Esta API RESTful sigue principios REST y proporciona respuestas consistentes y bien documentadas para todas las operaciones del sistema TienditaCampus.
