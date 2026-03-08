-- V013: Índices de rendimiento para reportes e IQR

CREATE INDEX IF NOT EXISTS idx_daily_sales_seller_dow 
ON daily_sales (seller_id, (EXTRACT(DOW FROM sale_date)::int));
