-- V017__create_export_views.sql
-- Crear vistas de exportación para benchmarking

-- ============================================
-- VISTA PRINCIPAL DE EXPORTACIÓN
-- ============================================

CREATE OR REPLACE VIEW v_daily_export AS
SELECT
    p.project_id,
    CURRENT_DATE::DATE as snapshot_date,
    q.query_id::TEXT as queryid,
    0::INT64 as dbid,
    0::INT64 as userid,
    pss.query::TEXT as query,
    pss.calls::INT64 as calls,
    COALESCE(pss.total_exec_time, 0)::FLOAT64 as total_exec_time_ms,
    COALESCE(pss.mean_exec_time, 0)::FLOAT64 as mean_exec_time_ms,
    COALESCE(pss.min_exec_time, 0)::FLOAT64 as min_exec_time_ms,
    COALESCE(pss.max_exec_time, 0)::FLOAT64 as max_exec_time_ms,
    COALESCE(pss.stddev_exec_time, 0)::FLOAT64 as stddev_exec_time_ms,
    COALESCE(e.records_returned, 0)::INT64 as rows_returned,
    COALESCE(e.shared_buffers_hits, 0)::INT64 as shared_blks_hit,
    COALESCE(e.shared_buffers_reads, 0)::INT64 as shared_blks_read,
    0::INT64 as shared_blks_dirtied,
    0::INT64 as shared_blks_written,
    0::INT64 as temp_blks_read,
    0::INT64 as temp_blks_written,
    CURRENT_TIMESTAMP as ingestion_timestamp
FROM
    projects p
    CROSS JOIN queries q
    LEFT JOIN pg_stat_statements pss
        ON pss.query ILIKE '%' || q.target_table || '%'
    LEFT JOIN executions e
        ON e.project_id = p.project_id
        AND e.query_id = q.query_id
        AND DATE(e.execution_timestamp) = CURRENT_DATE
WHERE
    pss.calls > 0
    OR e.execution_id IS NOT NULL
ORDER BY
    p.project_id,
    q.query_id,
    pss.calls DESC NULLS LAST;

COMMENT ON VIEW v_daily_export IS 'Vista principal para exportación diaria a BigQuery';

-- ============================================
-- VISTA ALTERNATIVA AGREGADA
-- ============================================

CREATE OR REPLACE VIEW v_daily_export_aggregated AS
SELECT
    p.project_id,
    CURRENT_DATE::DATE as snapshot_date,
    q.query_id::TEXT as queryid,
    q.query_type,
    COUNT(e.execution_id)::INT64 as calls,
    SUM(COALESCE(e.execution_time_ms, 0))::FLOAT64 as total_exec_time_ms,
    AVG(COALESCE(e.execution_time_ms, 0))::FLOAT64 as mean_exec_time_ms,
    MIN(COALESCE(e.execution_time_ms, 0))::FLOAT64 as min_exec_time_ms,
    MAX(COALESCE(e.execution_time_ms, 0))::FLOAT64 as max_exec_time_ms,
    STDDEV(COALESCE(e.execution_time_ms, 0))::FLOAT64 as stddev_exec_time_ms,
    SUM(COALESCE(e.records_returned, 0))::INT64 as rows_returned,
    SUM(COALESCE(e.shared_buffers_hits, 0))::INT64 as shared_blks_hit,
    SUM(COALESCE(e.shared_buffers_reads, 0))::INT64 as shared_blks_read,
    CURRENT_TIMESTAMP as ingestion_timestamp
FROM
    projects p
    INNER JOIN queries q ON p.project_id = q.project_id
    LEFT JOIN executions e ON q.query_id = e.query_id
WHERE
    DATE(e.execution_timestamp) = CURRENT_DATE
    OR e.execution_id IS NULL
GROUP BY
    p.project_id, q.query_id, q.query_type
ORDER BY
    p.project_id, q.query_id;

COMMENT ON VIEW v_daily_export_aggregated IS 'Vista agregada por tipo de query';
