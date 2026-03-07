-- ============================================================
-- TienditaCampus - Migración V013: Weekly Performance Materialized View (GAP-02)
-- ============================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS weekly_performance_mv AS
SELECT
  ds.seller_id,
  DATE_TRUNC('week', ds.sale_date)::DATE         AS week_start,
  (DATE_TRUNC('week', ds.sale_date) + INTERVAL '6 days')::DATE AS week_end,
  SUM(ds.total_investment)                       AS total_investment,
  SUM(ds.total_revenue)                          AS total_revenue,
  SUM(ds.total_profit)                           AS total_profit,
  AVG(ds.profit_margin)                          AS avg_profit_margin,
  SUM(ds.units_sold)                             AS total_units_sold,
  SUM(ds.units_lost)                             AS total_units_lost,
  SUM(ds.total_waste_cost)                       AS total_waste_cost,
  CASE WHEN SUM(ds.units_sold + ds.units_lost) > 0
       THEN (SUM(ds.units_lost)::NUMERIC /
             SUM(ds.units_sold + ds.units_lost)) * 100
       ELSE 0
  END                                            AS waste_rate_pct
FROM daily_sales ds
WHERE ds.is_closed = true
GROUP BY ds.seller_id, DATE_TRUNC('week', ds.sale_date)
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_weekly_performance_mv_seller_week ON weekly_performance_mv (seller_id, week_start);
