# 📊 **TABLAS DE BENCHMARKING - ESTRUCTURA COMPLETA**

## 🎯 **SISTEMA DE BENCHMARKING - TABLAS ESPECIALIZADAS**

---

## 📋 **TABLAS PRINCIPALES DE BENCHMARKING**

### **1. 📈 BENCHMARKING_SNAPSHOTS (Snapshots de Métricas)**
```sql
CREATE TABLE benchmarking_snapshots (
    id SERIAL PRIMARY KEY,                    -- 🎯 ID único del snapshot
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    snapshot_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metrics_data JSONB NOT NULL,               -- 📊 Datos JSON flexibles de métricas
    snapshot_type VARCHAR(50) DEFAULT 'performance',
    is_processed BOOLEAN DEFAULT false,        -- ✅ Si fue procesado/exportado
    processing_error TEXT,                     -- ❌ Error si falló procesamiento
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_snapshot_type CHECK (snapshot_type IN ('performance', 'export', 'backup', 'alert'))
);

-- Índices para rendimiento
CREATE INDEX idx_benchmarking_user_time 
ON benchmarking_snapshots(user_id, snapshot_time DESC);

CREATE INDEX idx_benchmarking_type_time 
ON benchmarking_snapshots(snapshot_type, snapshot_time DESC);

-- Índice GIN para búsquedas en JSONB
CREATE INDEX idx_benchmarking_metrics_gin 
ON benchmarking_snapshots USING GIN(metrics_data);

-- Índice parcial para snapshots no procesados
CREATE INDEX idx_benchmarking_unprocessed 
ON benchmarking_snapshots(id, snapshot_time) 
WHERE is_processed = false;
```

**Propósito:** Almacenar snapshots automáticos de métricas del sistema cada 6 horas

---

### **2. 🔍 QUERY_PERFORMANCE_LOG (Log de Rendimiento de Queries)**
```sql
CREATE TABLE query_performance_log (
    id SERIAL PRIMARY KEY,                    -- 🎯 ID único
    snapshot_id INTEGER REFERENCES benchmarking_snapshots(id) ON DELETE CASCADE,
    query_hash VARCHAR(64) NOT NULL,          -- 🔐 Hash único de la query
    query_text TEXT NOT NULL,                 -- 📝 Texto completo de la query
    execution_count INTEGER DEFAULT 1,        -- 🔄 Veces ejecutada
    total_exec_time DECIMAL(12,3) DEFAULT 0,  -- ⏱️ Tiempo total (ms)
    mean_exec_time DECIMAL(8,3) DEFAULT 0,    -- 📊 Tiempo promedio (ms)
    min_exec_time DECIMAL(8,3) DEFAULT 0,     -- ⚡ Tiempo mínimo (ms)
    max_exec_time DECIMAL(8,3) DEFAULT 0,     -- 🐌 Tiempo máximo (ms)
    rows_returned INTEGER DEFAULT 0,          -- 📊 Filas retornadas
    shared_blks_hit INTEGER DEFAULT 0,        -- 💾 Cache hits
    shared_blks_read INTEGER DEFAULT 0,       -- 💿 Cache reads
    local_blks_hit INTEGER DEFAULT 0,         -- 🏠 Local cache hits
    local_blks_read INTEGER DEFAULT 0,        -- 💿 Local cache reads
    temp_blks_read INTEGER DEFAULT 0,         -- 🌡️ Temp blocks
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_positive_times CHECK (
        total_exec_time >= 0 AND 
        mean_exec_time >= 0 AND 
        min_exec_time >= 0 AND 
        max_exec_time >= 0
    )
);

-- Índices para análisis
CREATE INDEX idx_query_performance_hash 
ON query_performance_log(query_hash, recorded_at DESC);

CREATE INDEX idx_query_performance_time 
ON query_performance_log(mean_exec_time DESC, recorded_at DESC);

CREATE INDEX idx_query_performance_slow 
ON query_performance_log(mean_exec_time, recorded_at) 
WHERE mean_exec_time > 100; -- Solo queries lentas
```

**Propósito:** Detalles específicos de rendimiento de cada query SQL

---

### **3. 📊 SYSTEM_METRICS (Métricas del Sistema)**
```sql
CREATE TABLE system_metrics (
    id SERIAL PRIMARY KEY,                    -- 🎯 ID único
    snapshot_id INTEGER REFERENCES benchmarking_snapshots(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,        -- 📝 Nombre de la métrica
    metric_value DECIMAL(15,6),              -- 📊 Valor numérico
    metric_unit VARCHAR(20),                  -- 📏 Unidad (ms, %, MB, etc.)
    metric_category VARCHAR(50),               -- 📂 Categoría (database, memory, cpu)
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_metric_category CHECK (metric_category IN ('database', 'memory', 'cpu', 'network', 'storage'))
);

-- Índices para análisis temporal
CREATE INDEX idx_system_metrics_name_time 
ON system_metrics(metric_name, recorded_at DESC);

CREATE INDEX idx_system_metrics_category_time 
ON system_metrics(metric_category, recorded_at DESC);

-- Vista materializada para análisis rápido
CREATE MATERIALIZED VIEW vw_system_metrics_summary AS
SELECT 
    metric_category,
    metric_name,
    metric_unit,
    AVG(metric_value) as avg_value,
    MIN(metric_value) as min_value,
    MAX(metric_value) as max_value,
    STDDEV(metric_value) as stddev_value,
    COUNT(*) as measurement_count,
    MAX(recorded_at) as last_measurement
FROM system_metrics
WHERE recorded_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY metric_category, metric_name, metric_unit;

-- Índice en vista materializada
CREATE INDEX idx_vw_system_metrics_category 
ON vw_system_metrics_summary(metric_category, avg_value DESC);
```

**Propósito:** Métricas del sistema (CPU, memoria, red, almacenamiento)

---

### **4. 🚨 PERFORMANCE_ALERTS (Alertas de Rendimiento)**
```sql
CREATE TABLE performance_alerts (
    id SERIAL PRIMARY KEY,                    -- 🎯 ID único
    snapshot_id INTEGER REFERENCES benchmarking_snapshots(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,          -- 🚨 Tipo de alerta
    severity VARCHAR(20) NOT NULL,            -- ⚠️ Severidad (low, medium, high, critical)
    title VARCHAR(255) NOT NULL,              -- 📝 Título de la alerta
    description TEXT,                         -- 📄 Descripción detallada
    metric_name VARCHAR(100),                 -- 📊 Métrica relacionada
    threshold_value DECIMAL(15,6),            -- 🎯 Umbral que activó la alerta
    actual_value DECIMAL(15,6),              -- 📈 Valor actual que activó
    recommendation TEXT,                      -- 💡 Recomendación
    is_resolved BOOLEAN DEFAULT false,        -- ✅ Si fue resuelta
    resolved_at TIMESTAMP,                    -- 🕐 Fecha de resolución
    resolved_by INTEGER REFERENCES users(id), -- 👤 Quién la resolvió
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_alert_type CHECK (alert_type IN ('slow_query', 'high_cpu', 'memory_leak', 'disk_full', 'connection_pool'))
    CONSTRAINT chk_severity CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);

-- Índices para gestión de alertas
CREATE INDEX idx_performance_alerts_unresolved 
ON performance_alerts(severity, created_at DESC) 
WHERE is_resolved = false;

CREATE INDEX idx_performance_alerts_type 
ON performance_alerts(alert_type, created_at DESC);
```

**Propósito:** Alertas automáticas cuando las métricas exceden umbrales

---

### **5. 📤 EXPORT_LOG (Log de Exportaciones)**
```sql
CREATE TABLE export_log (
    id SERIAL PRIMARY KEY,                    -- 🎯 ID único
    snapshot_id INTEGER REFERENCES benchmarking_snapshots(id) ON DELETE CASCADE,
    export_type VARCHAR(50) NOT NULL,         -- 📤 Tipo de exportación
    destination VARCHAR(255),                 -- 🌍 Destino (BigQuery, S3, etc.)
    status VARCHAR(20) DEFAULT 'pending',     -- 📊 Estado (pending, processing, completed, failed)
    records_count INTEGER DEFAULT 0,          -- 📊 Cantidad de registros
    file_size_bytes BIGINT DEFAULT 0,         -- 📁 Tamaño del archivo
    processing_time_ms INTEGER DEFAULT 0,     -- ⏱️ Tiempo de procesamiento
    error_message TEXT,                      -- ❌ Mensaje de error si falló
    retry_count INTEGER DEFAULT 0,           -- 🔄 Número de reintentos
    next_retry_at TIMESTAMP,                  -- 🕐 Próximo reintento
    completed_at TIMESTAMP,                   -- ✅ Fecha de completado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_export_type CHECK (export_type IN ('bigquery', 'csv', 'json', 'parquet'))
    CONSTRAINT chk_status CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'retrying'))
);

-- Índices para seguimiento
CREATE INDEX idx_export_log_status 
ON export_log(status, created_at DESC);

CREATE INDEX idx_export_log_retry 
ON export_log(next_retry_at) 
WHERE status = 'failed' AND retry_count < 3;
```

**Propósito:** Registro de exportaciones a sistemas externos (BigQuery, S3, etc.)

---

### **6. 🎯 BENCHMARKING_CONFIGURATIONS (Configuraciones)**
```sql
CREATE TABLE benchmarking_configurations (
    id SERIAL PRIMARY KEY,                    -- 🎯 ID único
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    config_key VARCHAR(100) NOT NULL,         -- 🔑 Clave de configuración
    config_value JSONB NOT NULL,               -- 💾 Valor en JSON flexible
    description TEXT,                         -- 📄 Descripción
    is_active BOOLEAN DEFAULT true,            -- ✅ Si está activa
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint única por usuario y clave
    CONSTRAINT unique_user_config UNIQUE(user_id, config_key)
);

-- Índices para lookup rápido
CREATE INDEX idx_benchmarking_config_active 
ON benchmarking_configurations(user_id, is_active) 
WHERE is_active = true;

-- Configuraciones por defecto
INSERT INTO benchmarking_configurations (user_id, config_key, config_value, description) VALUES
(1, 'snapshot_interval_minutes', '360', 'Intervalo en minutos para snapshots automáticos'),
(1, 'slow_query_threshold_ms', '100', 'Umbral en ms para considerar una query lenta'),
(1, 'export_to_bigquery', 'true', 'Exportar snapshots a BigQuery'),
(1, 'alert_cpu_threshold', '80', 'Umbral de CPU para alertas (%)'),
(1, 'alert_memory_threshold', '85', 'Umbral de memoria para alertas (%)');
```

**Propósito:** Configuraciones personalizables del sistema de benchmarking

---

## 🔗 **RELACIONES ENTRE TABLAS DE BENCHMARKING**

### **📊 Diagrama de Relaciones:**
```
BENCHMARKING_SNAPSHOTS (1) ──── (N) QUERY_PERFORMANCE_LOG
        │
        ├── (N) SYSTEM_METRICS
        ├── (N) PERFORMANCE_ALERTS
        ├── (N) EXPORT_LOG
        └── (N) BENCHMARKING_CONFIGURATIONS
```

### **🎯 Explicación de Relaciones:**

#### **1. BENCHMARKING_SNAPSHOTS → QUERY_PERFORMANCE_LOG**
- **Tipo:** One-to-Many (1:N)
- **Relación:** Un snapshot contiene múltiples logs de queries
- **Propósito:** Análisis detallado de rendimiento por período

#### **2. BENCHMARKING_SNAPSHOTS → SYSTEM_METRICS**
- **Tipo:** One-to-Many (1:N)
- **Relación:** Un snapshot contiene múltiples métricas del sistema
- **Propósito:** Monitoreo de recursos del sistema

#### **3. BENCHMARKING_SNAPSHOTS → PERFORMANCE_ALERTS**
- **Tipo:** One-to-Many (1:N)
- **Relación:** Un snapshot puede generar múltiples alertas
- **Propósito:** Gestión de notificaciones de rendimiento

#### **4. BENCHMARKING_SNAPSHOTS → EXPORT_LOG**
- **Tipo:** One-to-Many (1:N)
- **Relación:** Un snapshot puede tener múltiples intentos de exportación
- **Propósito:** Seguimiento de exportaciones a sistemas externos

---

## 🚀 **CONSULTAS SQL DE BENCHMARKING**

### **📈 Consultas Principales:**

#### **1. Queries Más Lentas del Sistema:**
```sql
SELECT 
    query_hash,
    LEFT(query_text, 100) as query_sample,
    execution_count,
    mean_exec_time,
    max_exec_time,
    total_exec_time,
    rows_returned,
    ROUND(100.0 * shared_blks_hit / NULLIF(shared_blks_hit + shared_blks_read, 0), 2) as cache_hit_rate,
    recorded_at
FROM query_performance_log
WHERE recorded_at >= CURRENT_DATE - INTERVAL '24 hours'
    AND mean_exec_time > 50
ORDER BY mean_exec_time DESC
LIMIT 20;
```

#### **2. Métricas del Sistema por Categoría:**
```sql
SELECT 
    sm.metric_category,
    sm.metric_name,
    sm.metric_unit,
    AVG(sm.metric_value) as avg_value,
    MIN(sm.metric_value) as min_value,
    MAX(sm.metric_value) as max_value,
    STDDEV(sm.metric_value) as stddev,
    COUNT(*) as measurements,
    MAX(sm.recorded_at) as last_measurement
FROM system_metrics sm
WHERE sm.recorded_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY sm.metric_category, sm.metric_name, sm.metric_unit
ORDER BY sm.metric_category, avg_value DESC;
```

#### **3. Alertas Activas por Severidad:**
```sql
SELECT 
    pa.severity,
    pa.alert_type,
    pa.title,
    pa.metric_name,
    pa.threshold_value,
    pa.actual_value,
    pa.recommendation,
    pa.created_at,
    u.name as reported_by
FROM performance_alerts pa
LEFT JOIN users u ON pa.snapshot_id IN (
    SELECT id FROM benchmarking_snapshots WHERE user_id = u.id
)
WHERE pa.is_resolved = false
ORDER BY 
    CASE pa.severity 
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
    END,
    pa.created_at DESC;
```

#### **4. Historial de Exportaciones:**
```sql
SELECT 
    el.export_type,
    el.destination,
    el.status,
    el.records_count,
    el.file_size_bytes,
    el.processing_time_ms,
    el.retry_count,
    el.created_at,
    CASE 
        WHEN el.status = 'completed' THEN '✅'
        WHEN el.status = 'failed' THEN '❌'
        WHEN el.status = 'processing' THEN '🔄'
        ELSE '⏳'
    END as status_icon
FROM export_log el
WHERE el.created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY el.created_at DESC;
```

#### **5. Análisis Temporal de Rendimiento:**
```sql
SELECT 
    DATE_TRUNC('hour', bs.snapshot_time) as hour_period,
    COUNT(*) as snapshot_count,
    AVG((bs.metrics_data->>'query_time')::float) as avg_query_time,
    AVG((bs.metrics_data->>'slow_queries')::int) as avg_slow_queries,
    MAX((bs.metrics_data->>'cache_hit_rate')::float) as max_cache_hit_rate,
    AVG((bs.metrics_data->>'active_connections')::int) as avg_connections,
    COUNT(CASE WHEN pa.id IS NOT NULL THEN 1 END) as alert_count
FROM benchmarking_snapshots bs
LEFT JOIN performance_alerts pa ON bs.id = pa.snapshot_id AND pa.is_resolved = false
WHERE bs.snapshot_time >= CURRENT_DATE - INTERVAL '24 hours'
GROUP BY hour_period
ORDER BY hour_period;
```

---

## ⚡ **FUNCIONES ESPECIALIZADAS DE BENCHMARKING**

### **🔧 Funciones PostgreSQL:**

#### **1. Análisis de Tendencias:**
```sql
CREATE OR REPLACE FUNCTION analyze_performance_trend(p_hours INTEGER DEFAULT 24)
RETURNS TABLE(
    hour_period TIMESTAMP,
    avg_query_time DECIMAL,
    slow_queries INTEGER,
    cache_hit_rate DECIMAL,
    alert_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('hour', bs.snapshot_time) as hour_period,
        AVG((bs.metrics_data->>'query_time')::float) as avg_query_time,
        AVG((bs.metrics_data->>'slow_queries')::int) as slow_queries,
        AVG((bs.metrics_data->>'cache_hit_rate')::float) as cache_hit_rate,
        COUNT(pa.id) as alert_count
    FROM benchmarking_snapshots bs
    LEFT JOIN performance_alerts pa ON bs.id = pa.snapshot_id
    WHERE bs.snapshot_time >= CURRENT_TIMESTAMP - INTERVAL '1 hour' * p_hours
    GROUP BY DATE_TRUNC('hour', bs.snapshot_time)
    ORDER BY hour_period;
END;
$$ LANGUAGE plpgsql;
```

#### **2. Detección de Queries Lentas:**
```sql
CREATE OR REPLACE FUNCTION detect_slow_queries(p_threshold_ms DECIMAL DEFAULT 100)
RETURNS TABLE(
    query_hash VARCHAR(64),
    query_text TEXT,
    execution_count INTEGER,
    mean_exec_time DECIMAL,
    recommendation TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        qpl.query_hash,
        LEFT(qpl.query_text, 200) as query_text,
        qpl.execution_count,
        qpl.mean_exec_time,
        CASE 
            WHEN qpl.mean_exec_time > 1000 THEN 'Considerar optimización urgente'
            WHEN qpl.mean_exec_time > 500 THEN 'Revisar índices'
            WHEN qpl.mean_exec_time > 100 THEN 'Monitorear rendimiento'
            ELSE 'Rendimiento aceptable'
        END as recommendation
    FROM query_performance_log qpl
    WHERE qpl.recorded_at >= CURRENT_DATE - INTERVAL '24 hours'
        AND qpl.mean_exec_time > p_threshold_ms
    ORDER BY qpl.mean_exec_time DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;
```

---

## 🎓 **RESUMEN PARA EXAMEN**

### **📊 6 Tablas de Benchmarking:**
1. **BENCHMARKING_SNAPSHOTS** - Snapshots automáticos de métricas
2. **QUERY_PERFORMANCE_LOG** - Detalles de rendimiento de queries
3. **SYSTEM_METRICS** - Métricas del sistema (CPU, memoria, etc.)
4. **PERFORMANCE_ALERTS** - Alertas automáticas de rendimiento
5. **EXPORT_LOG** - Registro de exportaciones a sistemas externos
6. **BENCHMARKING_CONFIGURATIONS** - Configuraciones personalizables

### **🔗 Relaciones Clave:**
- **BENCHMARKING_SNAPSHOTS** es la tabla central (1:N con todas las demás)
- **JSONB** para almacenamiento flexible de métricas
- **Índices GIN** para búsquedas rápidas en JSON
- **Vistas materializadas** para análisis de rendimiento

### **🚀 Características Técnicas:**
- **Snapshots automáticos** cada 6 horas
- **pg_stat_statements** para análisis de queries
- **Exportación a BigQuery** para análisis masivo
- **Alertas automáticas** basadas en umbrales
- **Retry automático** para exportaciones fallidas

### **📈 Consultas Importantes:**
- **Análisis de queries lentas** con métricas detalladas
- **Tendencias temporales** de rendimiento
- **Alertas activas** por severidad
- **Historial de exportaciones** con estado

**¡Este sistema de benchmarking proporciona monitoreo enterprise completo!** 🚀
