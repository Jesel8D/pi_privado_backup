-- Vista oficial de exportación para Benchmarking Unidad 2
CREATE OR REPLACE VIEW v_daily_export AS
SELECT 
    (SELECT project_id FROM projects LIMIT 1) as project_id, -- Ajustar según el ID de tu equipo
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
    temp_blks_written
FROM pg_stat_statements
WHERE calls > 0;
