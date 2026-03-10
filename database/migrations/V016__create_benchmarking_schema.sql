-- Benchmarking (Unidad 2) - Schema requerido

-- 1) Extensión para métricas
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- 2) Tablas requeridas por la rúbrica
CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    project_type VARCHAR(20) NOT NULL CHECK (
        project_type IN (
            'ECOMMERCE', 'SOCIAL', 'FINANCIAL', 'HEALTHCARE', 'IOT',
            'EDUCATION', 'CONTENT', 'ENTERPRISE', 'LOGISTICS', 'GOVERNMENT'
        )
    ),
    description TEXT,
    db_engine VARCHAR(20) NOT NULL CHECK (
        db_engine IN ('POSTGRESQL', 'MYSQL', 'MONGODB', 'OTHER')
    )
);

CREATE TABLE IF NOT EXISTS queries (
    query_id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(project_id),
    query_description TEXT NOT NULL,
    query_sql TEXT NOT NULL,
    target_table VARCHAR(100),
    query_type VARCHAR(30) CHECK (
        query_type IN (
            'SIMPLE_SELECT', 'AGGREGATION', 'JOIN',
            'WINDOW_FUNCTION', 'SUBQUERY', 'WRITE_OPERATION'
        )
    )
);

CREATE TABLE IF NOT EXISTS executions (
    execution_id BIGSERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(project_id),
    query_id INT REFERENCES queries(query_id),
    index_strategy VARCHAR(20) CHECK (
        index_strategy IN ('NO_INDEX', 'SINGLE_INDEX', 'COMPOSITE_INDEX')
    ),
    execution_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms BIGINT,
    records_examined BIGINT,
    records_returned BIGINT,
    dataset_size_rows BIGINT,
    dataset_size_mb NUMERIC,
    concurrent_sessions INT,
    shared_buffers_hits BIGINT,
    shared_buffers_reads BIGINT
);

-- 3) Requerimiento del profesor: el proyecto debe reportar con ID = 2
INSERT INTO projects (project_id, project_type, description, db_engine)
VALUES (
    2,
    'ECOMMERCE',
    'TienditaCampus - Sistema de Comercio Electrónico Universitario',
    'POSTGRESQL'
)
ON CONFLICT (project_id) DO NOTHING;

-- Asegurar que el sequence no choque si ya hay inserts
SELECT setval(pg_get_serial_sequence('projects', 'project_id'), GREATEST((SELECT COALESCE(MAX(project_id), 0) FROM projects), 2));

-- 4) Vista oficial de exportación para Benchmarking Unidad 2
CREATE OR REPLACE VIEW v_daily_export AS
SELECT 
    2 as project_id,
    CURRENT_DATE as snapshot_date,
    queryid,
    dbid,
    userid,
    query,
    calls,
    total_exec_time as total_exec_time_ms,
    mean_exec_time as mean_exec_time_ms,
    min_exec_time as min_exec_time_ms,
    max_exec_time as max_exec_time_ms,
    stddev_exec_time as stddev_exec_time_ms,
    rows as rows_returned,
    shared_blks_hit,
    shared_blks_read,
    shared_blks_dirtied,
    shared_blks_written,
    temp_blks_read,
    temp_blks_written,
    NOW() as ingestion_timestamp
FROM pg_stat_statements
WHERE calls > 0
  AND query NOT LIKE '%pg_stat_statements%'
ORDER BY calls DESC;
