# 🗄️ **TABLAS DE TIENDITACAMPUS - ESTRUCTURA COMPLETA**

## 📋 **LISTADO DE TABLAS PRINCIPALES**

---

### **1. 📝 USERS (Usuarios)**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,                    -- 🎯 ID único
    email VARCHAR(255) UNIQUE NOT NULL,       -- 📧 Email único
    password_hash VARCHAR(255) NOT NULL,      -- 🔐 Hash de contraseña
    role VARCHAR(50) DEFAULT 'vendor',        -- 👤 Rol (vendor/admin)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Propósito:** Almacenar usuarios del sistema con autenticación segura

---

### **2. 💰 DAILY_SALES (Ventas Diarias)**
```sql
CREATE TABLE daily_sales (
    id SERIAL PRIMARY KEY,                    -- 🎯 ID único
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sale_date DATE NOT NULL,                  -- 📅 Fecha de venta
    total_revenue DECIMAL(10,2) DEFAULT 0,    -- 💵 Ingresos totales
    profit_margin DECIMAL(5,2) DEFAULT 0,      -- 📈 Margen de ganancia
    break_even_units INTEGER DEFAULT 0,        -- ⚖️ Unidades punto equilibrio
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,                       -- 🕐 Cierre de día
    CONSTRAINT unique_user_date UNIQUE(user_id, sale_date)  -- 🚫 Una venta por día
);
```
**Propósito:** Registrar ventas diarias por usuario con métricas calculadas

---

### **3. 📊 SALE_DETAILS (Detalles de Venta)**
```sql
CREATE TABLE sale_details (
    id SERIAL PRIMARY KEY,                    -- 🎯 ID único
    daily_sale_id INTEGER NOT NULL REFERENCES daily_sales(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity_prepared INTEGER NOT NULL DEFAULT 0,  -- 📦 Cantidad preparada
    quantity_sold INTEGER NOT NULL DEFAULT 0,      -- 💰 Cantidad vendida
    unit_cost DECIMAL(10,2) NOT NULL,              -- 💲 Costo unitario
    unit_price DECIMAL(10,2) NOT NULL,             -- 💵 Precio unitario
    waste_reason TEXT,                              -- 🗑️ Razón de merma
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_quantity CHECK (quantity_sold <= quantity_prepared),
    CONSTRAINT chk_positive CHECK (quantity_prepared >= 0 AND quantity_sold >= 0)
);
```
**Propósito:** Detallar productos vendidos en cada venta diaria

---

### **4. 🛍️ PRODUCTS (Productos)**
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,                    -- 🎯 ID único
    name VARCHAR(255) NOT NULL,               -- 📝 Nombre del producto
    category VARCHAR(100) NOT NULL,          -- 📂 Categoría
    base_cost DECIMAL(10,2) NOT NULL,         -- 💰 Costo base
    suggested_price DECIMAL(10,2) NOT NULL,   -- 💵 Precio sugerido
    is_active BOOLEAN DEFAULT true,            -- ✅ Producto activo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Propósito:** Catálogo de productos con información de costos y precios

---

### **5. 📦 INVENTORY_RECORDS (Registros de Inventario)**
```sql
CREATE TABLE inventory_records (
    id SERIAL PRIMARY KEY,                    -- 🎯 ID único
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,                 -- 📊 Cantidad
    operation_type VARCHAR(20) NOT NULL CHECK (operation_type IN ('IN', 'OUT', 'ADJUST')),
    unit_cost DECIMAL(10,2),                  -- 💲 Costo unitario
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_quantity_operation CHECK (
        (operation_type = 'IN' AND quantity > 0) OR
        (operation_type = 'OUT' AND quantity > 0) OR
        (operation_type = 'ADJUST' AND quantity >= 0)
    )
);
```
**Propósito:** Control de movimientos de inventario por usuario y producto

---

### **6. 📈 BENCHMARKING_SNAPSHOTS (Snapshots de Benchmarking)**
```sql
CREATE TABLE benchmarking_snapshots (
    id SERIAL PRIMARY KEY,                    -- 🎯 ID único
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    snapshot_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metrics_data JSONB NOT NULL,               -- 📊 Datos de métricas (JSON flexible)
    snapshot_type VARCHAR(50) DEFAULT 'performance',
    is_processed BOOLEAN DEFAULT false,        -- ✅ Procesado
    CONSTRAINT chk_snapshot_type CHECK (snapshot_type IN ('performance', 'export', 'backup'))
);
```
**Propósito:** Almacenar métricas de rendimiento para análisis de benchmarking

---

## 🔗 **RELACIONES ENTRE TABLAS**

### **📊 Diagrama de Relaciones:**
```
USERS (1) ──── (N) DAILY_SALES (1) ──── (N) SALE_DETAILS (N) ──── (1) PRODUCTS
  │                    │                       │
  │                    │                       │
  └── (N) INVENTORY_RECORDS ────────────────────┘
  │
  └── (N) BENCHMARKING_SNAPSHOTS
```

### **🎯 Explicación de Relaciones:**

#### **1. USERS → DAILY_SALES**
- **Tipo:** One-to-Many (1:N)
- **Relación:** Un usuario tiene múltiples ventas diarias
- **Constraint:** `ON DELETE CASCADE` (si elimina usuario, elimina ventas)
- **Índice:** `UNIQUE(user_id, sale_date)` (una venta por día)

#### **2. DAILY_SALES → SALE_DETAILS**
- **Tipo:** One-to-Many (1:N)
- **Relación:** Una venta diaria tiene múltiples productos vendidos
- **Constraint:** `ON DELETE CASCADE` (si elimina venta, elimina detalles)

#### **3. PRODUCTS → SALE_DETAILS**
- **Tipo:** One-to-Many (1:N)
- **Relación:** Un producto aparece en múltiples ventas
- **Constraint:** `ON DELETE RESTRICT` (no elimina producto si tiene ventas)

#### **4. PRODUCTS → INVENTORY_RECORDS**
- **Tipo:** One-to-Many (1:N)
- **Relación:** Un producto tiene múltiples movimientos de inventario
- **Constraint:** `ON DELETE CASCADE` (si elimina producto, elimina movimientos)

#### **5. USERS → INVENTORY_RECORDS**
- **Tipo:** One-to-Many (1:N)
- **Relación:** Un usuario gestiona múltiples registros de inventario
- **Constraint:** `ON DELETE CASCADE` (si elimina usuario, elimina registros)

#### **6. USERS → BENCHMARKING_SNAPSHOTS**
- **Tipo:** One-to-Many (1:N)
- **Relación:** Un usuario genera múltiples snapshots de métricas
- **Constraint:** `ON DELETE CASCADE` (si elimina usuario, elimina snapshots)

---

## 🚀 **ÍNDICES Y OPTIMIZACIÓN**

### **📈 Índices Estratégicos:**

#### **1. Índices de Rendimiento:**
```sql
-- Para consultas por usuario y fecha
CREATE INDEX idx_daily_sales_user_date 
ON daily_sales(user_id, sale_date DESC);

-- Para análisis de productos
CREATE INDEX idx_sale_details_product_date 
ON sale_details(product_id, daily_sale_id);

-- Para tracking de inventario
CREATE INDEX idx_inventory_product_user 
ON inventory_records(product_id, user_id, created_at DESC);

-- Para búsquedas temporales de benchmarking
CREATE INDEX idx_benchmarking_user_time 
ON benchmarking_snapshots(user_id, snapshot_time DESC);

-- Índice GIN para JSONB (métricas)
CREATE INDEX idx_benchmarking_metrics_gin 
ON benchmarking_snapshots USING GIN(metrics_data);
```

#### **2. Vistas Materializadas:**
```sql
-- Vista para análisis de rendimiento de productos
CREATE MATERIALIZED VIEW vw_product_performance AS
SELECT 
    p.id,
    p.name,
    p.category,
    COUNT(DISTINCT ds.id) as days_sold,
    COALESCE(SUM(sd.quantity_sold), 0) as total_units_sold,
    COALESCE(SUM(sd.total_revenue), 0) as total_revenue,
    COALESCE(AVG(sd.unit_price), p.suggested_price) as avg_selling_price,
    COALESCE(
        (COALESCE(AVG(sd.unit_price), p.suggested_price) - p.base_cost) / p.base_cost * 100, 
        0
    ) as profit_margin_percentage
FROM products p
LEFT JOIN sale_details sd ON p.id = sd.product_id
LEFT JOIN daily_sales ds ON sd.daily_sale_id = ds.id
WHERE p.is_active = true
GROUP BY p.id, p.name, p.category, p.base_cost, p.suggested_price
WITH DATA;

-- Índices en vista materializada
CREATE INDEX idx_vw_product_performance_revenue 
ON vw_product_performance(total_revenue DESC);

CREATE INDEX idx_vw_product_performance_margin 
ON vw_product_performance(profit_margin_percentage DESC);
```

---

## 🔧 **FUNCIONES Y TRIGGERS**

### **⚡ Funciones PostgreSQL:**

#### **1. Cálculo de Stock Actual:**
```sql
CREATE OR REPLACE FUNCTION calculate_current_stock(p_product_id INTEGER, p_user_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    current_stock INTEGER;
BEGIN
    SELECT COALESCE(SUM(
        CASE WHEN operation_type = 'IN' THEN quantity
        WHEN operation_type = 'OUT' THEN -quantity
        WHEN operation_type = 'ADJUST' THEN quantity
        END
    ), 0) INTO current_stock
    FROM inventory_records
    WHERE product_id = p_product_id AND user_id = p_user_id;
    
    RETURN current_stock;
END;
$$ LANGUAGE plpgsql;
```

#### **2. Actualización Automática de Totales:**
```sql
CREATE OR REPLACE FUNCTION update_daily_sale_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE daily_sales 
    SET 
        total_revenue = (
            SELECT COALESCE(SUM(quantity_sold * unit_price), 0) 
            FROM sale_details 
            WHERE daily_sale_id = NEW.daily_sale_id
        ),
        profit_margin = CASE 
            WHEN (SELECT COALESCE(SUM(quantity_sold * unit_cost), 0) FROM sale_details WHERE daily_sale_id = NEW.daily_sale_id) > 0
            THEN (
                (SELECT COALESCE(SUM(quantity_sold * unit_price), 0) FROM sale_details WHERE daily_sale_id = NEW.daily_sale_id) -
                (SELECT COALESCE(SUM(quantity_sold * unit_cost), 0) FROM sale_details WHERE daily_sale_id = NEW.daily_sale_id)
            ) / (SELECT COALESCE(SUM(quantity_sold * unit_cost), 0) FROM sale_details WHERE daily_sale_id = NEW.daily_sale_id) * 100
            ELSE 0
        END
    WHERE id = NEW.daily_sale_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### **🔄 Triggers Automáticos:**

#### **1. Trigger para Actualizar Totales:**
```sql
CREATE TRIGGER trg_update_sale_totals
AFTER INSERT OR UPDATE OR DELETE ON sale_details
FOR EACH ROW
EXECUTE FUNCTION update_daily_sale_totals();
```

#### **2. Trigger para Timestamp de Productos:**
```sql
CREATE OR REPLACE FUNCTION update_product_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_product_timestamp
AFTER INSERT ON inventory_records
FOR EACH ROW
EXECUTE FUNCTION update_product_timestamp();
```

---

## 🎯 **CONSULTAS SQL EJEMPLO**

### **📊 Consultas Principales:**

#### **1. Métricas de Venta por Usuario:**
```sql
SELECT 
    u.name,
    u.email,
    COUNT(ds.id) as total_sales_days,
    SUM(ds.total_revenue) as total_revenue,
    AVG(ds.profit_margin) as avg_profit_margin,
    MAX(ds.sale_date) as last_sale_date
FROM users u
LEFT JOIN daily_sales ds ON u.id = ds.user_id
WHERE u.role = 'vendor'
GROUP BY u.id, u.name, u.email
ORDER BY total_revenue DESC;
```

#### **2. Productos Más Vendidos:**
```sql
SELECT 
    p.name,
    p.category,
    SUM(sd.quantity_sold) as total_units_sold,
    SUM(sd.total_revenue) as total_revenue,
    AVG(sd.unit_price) as avg_price,
    COUNT(DISTINCT sd.daily_sale_id) as days_sold
FROM products p
INNER JOIN sale_details sd ON p.id = sd.product_id
WHERE p.is_active = true
GROUP BY p.id, p.name, p.category
ORDER BY total_units_sold DESC
LIMIT 10;
```

#### **3. Análisis de Inventario:**
```sql
SELECT 
    p.name,
    p.category,
    calculate_current_stock(p.id, u.id) as current_stock,
    COALESCE(SUM(
        CASE WHEN ir.operation_type = 'OUT' THEN ir.quantity ELSE 0 END
    ), 0) as total_consumed,
    COALESCE(SUM(
        CASE WHEN ir.operation_type = 'IN' THEN ir.quantity ELSE 0 END
    ), 0) as total_received
FROM products p
CROSS JOIN users u
LEFT JOIN inventory_records ir ON p.id = ir.product_id AND u.id = ir.user_id
WHERE u.role = 'vendor' AND p.is_active = true
GROUP BY p.id, p.name, p.category, u.id
ORDER BY total_consumed DESC;
```

#### **4. Métricas de Benchmarking:**
```sql
SELECT 
    DATE_TRUNC('hour', snapshot_time) as hour_period,
    COUNT(*) as snapshot_count,
    AVG((metrics_data->>'query_time')::float) as avg_query_time,
    AVG((metrics_data->>'slow_queries')::int) as avg_slow_queries,
    MAX((metrics_data->>'cache_hit_rate')::float) as max_cache_hit_rate
FROM benchmarking_snapshots 
WHERE snapshot_time >= CURRENT_DATE - INTERVAL '24 hours'
GROUP BY hour_period
ORDER BY hour_period;
```

---

## 🎓 **RESUMEN PARA EXAMEN**

### **📋 6 Tablas Principales:**
1. **USERS** - Autenticación y gestión de usuarios
2. **DAILY_SALES** - Ventas diarias con métricas
3. **SALE_DETAILS** - Detalles de productos vendidos
4. **PRODUCTS** - Catálogo de productos
5. **INVENTORY_RECORDS** - Control de inventario
6. **BENCHMARKING_SNAPSHOTS** - Métricas de rendimiento

### **🔗 Relaciones Clave:**
- **USERS → DAILY_SALES** (1:N) - Ventas por usuario
- **DAILY_SALES → SALE_DETAILS** (1:N) - Productos por venta
- **PRODUCTS → SALE_DETAILS** (1:N) - Ventas por producto
- **PRODUCTS → INVENTORY_RECORDS** (1:N) - Movimientos por producto

### **🚀 Optimizaciones:**
- **Índices compuestos** para consultas frecuentes
- **Vistas materializadas** para análisis complejos
- **Funciones PostgreSQL** para lógica de negocio
- **Triggers automáticos** para mantener consistencia

### **📊 Consultas Importantes:**
- **Métricas por usuario** con agregaciones
- **Top productos** con ranking
- **Análisis de inventario** con funciones personalizadas
- **Benchmarking temporal** con JSONB

**¡Este diseño garantiza integridad, rendimiento y escalabilidad!** 🚀
