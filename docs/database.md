# Database Schema - TienditaCampus

## 🗄️ Overview

Base de datos PostgreSQL 16 con arquitectura relacional optimizada para cafeterías escolares.

## 📊 Diagrama de Entidades

```mermaid
erDiagram
    USERS {
        User {
            uuid id PK
            string email
            string name
            string password_hash
            enum role
            boolean is_active
            timestamp created_at
            timestamp last_login
        }
    }
    
    PRODUCTS {
        Product {
            uuid id PK
            string name
            text description
            string category
            decimal unit_cost
            decimal sale_price
            integer min_stock
            boolean is_active
            timestamp created_at
        }
    }
    
    INVENTORY {
        InventoryRecord {
            uuid id PK
            uuid product_id FK
            uuid user_id FK
            integer quantity
            decimal unit_cost
            date expiration_date
            string supplier
            timestamp created_at
        }
    }
    
    DAILY_SALES {
        DailySale {
            uuid id PK
            uuid seller_id FK
            date sale_date
            decimal total_investment
            decimal total_revenue
            decimal total_waste_cost
            decimal profit_margin
            integer units_sold
            integer units_lost
            decimal break_even_units
            boolean is_closed
            timestamp created_at
            timestamp closed_at
        }
    }
    
    SALE_DETAILS {
        SaleDetail {
            uuid id PK
            uuid daily_sale_id FK
            uuid product_id FK
            integer quantity_prepared
            integer quantity_sold
            integer quantity_lost
            decimal unit_cost
            decimal unit_price
            decimal waste_cost
            enum waste_reason
            timestamp created_at
        }
    }
    
    AUDIT_LOGS {
        AuditLog {
            uuid id PK
            uuid user_id FK
            string action
            string resource
            string ip_address
            text user_agent
            enum result
            jsonb details
            timestamp created_at
        }
    }
    
    User ||--o{ DailySale : sells
    User ||--o{ InventoryRecord : owns
    User ||--o{ AuditLog : performs
    Product ||--o{ InventoryRecord : stocked_in
    Product ||--o{ SaleDetail : sold_as
    DailySale ||--|{ SaleDetail : contains
```

## 📋 Tablas Principales

### users
Gestión de usuarios y autenticación del sistema.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
```

### products
Catálogo de productos disponibles para venta.

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL CHECK (unit_cost >= 0),
    sale_price DECIMAL(10,2) NOT NULL CHECK (sale_price >= 0),
    min_stock INTEGER DEFAULT 10 CHECK (min_stock >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_name ON products(name);
```

### inventory_records
Control de stock con método FIFO.

```sql
CREATE TABLE inventory_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_cost DECIMAL(10,2) NOT NULL CHECK (unit_cost >= 0),
    expiration_date DATE,
    supplier VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_product ON inventory_records(product_id);
CREATE INDEX idx_inventory_user ON inventory_records(user_id);
CREATE INDEX idx_inventory_expiration ON inventory_records(expiration_date);
```

### daily_sales
Registros diarios de ventas y métricas calculadas.

```sql
CREATE TABLE daily_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sale_date DATE NOT NULL,
    total_investment DECIMAL(12,2) DEFAULT 0 CHECK (total_investment >= 0),
    total_revenue DECIMAL(12,2) DEFAULT 0 CHECK (total_revenue >= 0),
    total_waste_cost DECIMAL(12,2) DEFAULT 0 CHECK (total_waste_cost >= 0),
    profit_margin DECIMAL(5,2) DEFAULT 0 CHECK (profit_margin >= -100 AND profit_margin <= 100),
    units_sold INTEGER DEFAULT 0 CHECK (units_sold >= 0),
    units_lost INTEGER DEFAULT 0 CHECK (units_lost >= 0),
    break_even_units DECIMAL(10,2),
    is_closed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX idx_daily_sales_user_date ON daily_sales(seller_id, sale_date);
CREATE INDEX idx_daily_sales_date ON daily_sales(sale_date);
CREATE INDEX idx_daily_sales_closed ON daily_sales(is_closed);
```

### sale_details
Detalles de productos vendidos por día.

```sql
CREATE TABLE sale_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_sale_id UUID NOT NULL REFERENCES daily_sales(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity_prepared INTEGER NOT NULL CHECK (quantity_prepared > 0),
    quantity_sold INTEGER DEFAULT 0 CHECK (quantity_sold >= 0),
    quantity_lost INTEGER DEFAULT 0 CHECK (quantity_lost >= 0),
    unit_cost DECIMAL(10,2) NOT NULL CHECK (unit_cost >= 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    waste_cost DECIMAL(10,2) DEFAULT 0 CHECK (waste_cost >= 0),
    waste_reason VARCHAR(50) CHECK (waste_reason IN ('expired', 'damaged', 'other', null)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sale_details_daily_sale ON sale_details(daily_sale_id);
CREATE INDEX idx_sale_details_product ON sale_details(product_id);
```

### audit_logs
Registro completo de auditoría del sistema.

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    result VARCHAR(50) NOT NULL CHECK (result IN ('success', 'failure')),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_result ON audit_logs(result);
```

## 🔧 Vistas Materializadas

### vw_product_performance
Análisis de rendimiento por producto.

```sql
CREATE MATERIALIZED VIEW vw_product_performance AS
SELECT 
    p.id,
    p.name,
    p.category,
    COUNT(DISTINCT ds.id) as days_sold,
    COALESCE(SUM(sd.quantity_sold), 0) as total_units_sold,
    COALESCE(SUM(sd.quantity_sold * sd.unit_price), 0) as total_revenue,
    COALESCE(SUM(sd.quantity_lost * sd.unit_cost), 0) as total_waste_cost,
    COALESCE(AVG(sd.unit_price), 0) as avg_sale_price,
    COALESCE(SUM(sd.quantity_sold) / NULLIF(COUNT(DISTINCT ds.id), 0), 0) as avg_daily_sales,
    p.is_active
FROM products p
LEFT JOIN sale_details sd ON p.id = sd.product_id
LEFT JOIN daily_sales ds ON sd.daily_sale_id = ds.id
WHERE ds.is_closed = true
GROUP BY p.id, p.name, p.category, p.is_active;

CREATE INDEX idx_vw_product_performance_name ON vw_product_performance(name);
CREATE INDEX idx_vw_product_performance_category ON vw_product_performance(category);
```

### vw_daily_metrics
Métricas diarias consolidadas.

```sql
CREATE MATERIALIZED VIEW vw_daily_metrics AS
SELECT 
    ds.sale_date,
    COUNT(DISTINCT ds.seller_id) as active_sellers,
    COUNT(*) as total_sales,
    SUM(ds.total_revenue) as total_revenue,
    SUM(ds.total_investment) as total_investment,
    AVG(ds.profit_margin) as avg_profit_margin,
    SUM(ds.units_sold) as total_units_sold,
    SUM(ds.units_lost) as total_units_lost,
    SUM(ds.total_waste_cost) as total_waste_cost
FROM daily_sales ds
WHERE ds.is_closed = true
GROUP BY ds.sale_date
ORDER BY ds.sale_date DESC;

CREATE INDEX idx_vw_daily_metrics_date ON vw_daily_metrics(sale_date);
```

### vw_inventory_status
Estado actual del inventario.

```sql
CREATE MATERIALIZED VIEW vw_inventory_status AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.category,
    COALESCE(SUM(ir.quantity), 0) as current_stock,
    COALESCE(SUM(ir.quantity * ir.unit_cost), 0) as total_investment,
    p.min_stock,
    CASE 
        WHEN COALESCE(SUM(ir.quantity), 0) <= p.min_stock THEN 'critical'
        WHEN COALESCE(SUM(ir.quantity), 0) <= p.min_stock * 1.5 THEN 'low'
        ELSE 'normal'
    END as stock_status,
    MAX(ir.expiration_date) as next_expiration
FROM products p
LEFT JOIN inventory_records ir ON p.id = ir.product_id
WHERE p.is_active = true
GROUP BY p.id, p.name, p.category, p.min_stock;

CREATE INDEX idx_vw_inventory_status_product ON vw_inventory_status(product_id);
CREATE INDEX idx_vw_inventory_status_status ON vw_inventory_status(stock_status);
```

## 🔍 Funciones de Utilidad

### Funciones de Análisis

```sql
-- Calcular ROI para un período
CREATE OR REPLACE FUNCTION calculate_roi(
    p_user_id UUID,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
) RETURNS TABLE (
    investment DECIMAL,
    revenue DECIMAL,
    net_profit DECIMAL,
    roi DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(total_investment), 0) as investment,
        COALESCE(SUM(total_revenue), 0) as revenue,
        COALESCE(SUM(total_revenue - total_investment), 0) as net_profit,
        CASE 
            WHEN COALESCE(SUM(total_investment), 0) > 0 
            THEN (COALESCE(SUM(total_revenue - total_investment), 0) / COALESCE(SUM(total_investment), 0)) * 100
            ELSE 0 
        END as roi
    FROM daily_sales 
    WHERE seller_id = p_user_id
    AND is_closed = true
    AND (p_start_date IS NULL OR sale_date >= p_start_date)
    AND (p_end_date IS NULL OR sale_date <= p_end_date);
END;
$$ LANGUAGE plpgsql;

-- Predicción de ventas por día de semana
CREATE OR REPLACE FUNCTION predict_sales(
    p_product_id UUID,
    p_weekday INTEGER
) RETURNS TABLE (
    suggested_quantity INTEGER,
    confidence DECIMAL,
    sample_size INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        PERCENTILE_CONT(0.5) WITHIN GROUP (quantity_sold) as suggested_quantity,
        COUNT(*) as sample_size,
        CASE 
            WHEN COUNT(*) >= 3 THEN 0.85
            ELSE COUNT(*)::DECIMAL / 10.0
        END as confidence
    FROM sale_details sd
    JOIN daily_sales ds ON sd.daily_sale_id = ds.id
    WHERE sd.product_id = p_product_id
    AND EXTRACT(DOW FROM ds.sale_date) = p_weekday
    AND ds.is_closed = true
    GROUP BY EXTRACT(DOW FROM ds.sale_date);
END;
$$ LANGUAGE plpgsql;
```

## 📈 Triggers Automáticos

### Actualización de Inventario

```sql
-- Consumir inventario automáticamente al cerrar día
CREATE OR REPLACE FUNCTION consume_inventory_on_close()
RETURNS TRIGGER AS $$
BEGIN
    -- Consumir unidades vendidas del inventario
    UPDATE inventory_records ir
    SET quantity = quantity - (
        SELECT COALESCE(SUM(quantity_sold), 0)
        FROM sale_details sd
        WHERE sd.daily_sale_id = NEW.id
        AND sd.product_id = ir.product_id
    )
    WHERE ir.product_id IN (
        SELECT DISTINCT product_id 
        FROM sale_details 
        WHERE daily_sale_id = NEW.id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_consume_inventory
AFTER UPDATE ON daily_sales
FOR EACH ROW
WHEN (OLD.is_closed = false AND NEW.is_closed = true)
EXECUTE FUNCTION consume_inventory_on_close();
```

### Auditoría Automática

```sql
-- Registrar cambios importantes en auditoría
CREATE OR REPLACE FUNCTION audit_daily_sales_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        resource,
        details,
        result
    ) VALUES (
        NEW.seller_id,
        CASE 
            WHEN OLD.is_closed = false AND NEW.is_closed = true THEN 'close_daily_sale'
            WHEN OLD.total_revenue != NEW.total_revenue THEN 'update_revenue'
            ELSE 'update_daily_sale'
        END,
        'daily_sales',
        json_build_object(
            'old_values', row_to_json(OLD),
            'new_values', row_to_json(NEW)
        ),
        'success'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_daily_sales
AFTER UPDATE OR INSERT ON daily_sales
FOR EACH ROW
EXECUTE FUNCTION audit_daily_sales_changes();
```

## 🔐 Restricciones y Validaciones

### Business Rules

```sql
-- Evitar ventas duplicadas en el mismo día
ALTER TABLE daily_sales ADD CONSTRAINT chk_one_open_sale_per_day 
CHECK (
    is_closed = true OR 
    id NOT IN (
        SELECT id FROM daily_sales 
        WHERE seller_id = daily_sales.seller_id 
        AND sale_date = daily_sales.sale_date 
        AND is_closed = false
    )
);

-- Validar cantidades en sale_details
ALTER TABLE sale_details ADD CONSTRAINT chk_quantity_logic 
CHECK (
    quantity_prepared >= quantity_sold + quantity_lost
);

-- Validar fechas lógicas
ALTER TABLE daily_sales ADD CONSTRAINT chk_sale_date_not_future 
CHECK (
    sale_date <= CURRENT_DATE
);
```

## 📊 Estadísticas y Rendimiento

### Configuración pg_stat_statements

```sql
-- Habilitar extensión
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Configurar parámetros
ALTER SYSTEM SET pg_stat_statements.track = 'all';
ALTER SYSTEM SET pg_stat_statements.max = 10000;
ALTER SYSTEM SET pg_stat_statements.track_utility = true;
SELECT pg_reload_conf();

-- Consulta de rendimiento
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

## 🔄 Mantenimiento

### Actualización de Vistas Materializadas

```sql
-- Función para refrescar vistas
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY vw_product_performance;
    REFRESH MATERIALIZED VIEW CONCURRENTLY vw_daily_metrics;
    REFRESH MATERIALIZED VIEW CONCURRENTLY vw_inventory_status;
END;
$$ LANGUAGE plpgsql;

-- Programar actualización diaria (requiere pg_cron extension)
-- O ejecutar manualmente:
SELECT refresh_materialized_views();
```

### Limpieza de Logs

```sql
-- Mantener solo 90 días de logs de auditoría
DELETE FROM audit_logs 
WHERE created_at < CURRENT_DATE - INTERVAL '90 days';

-- Mantener 2 años de datos de ventas
DELETE FROM daily_sales 
WHERE sale_date < CURRENT_DATE - INTERVAL '2 years';
```

Este esquema está optimizado para alto rendimiento, escalabilidad y cumplimiento de requisitos de auditoría para sistemas de gestión de cafeterías.
