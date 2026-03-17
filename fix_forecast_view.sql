CREATE MATERIALIZED VIEW vw_daily_production_forecast AS
WITH calculated_demand AS (
    SELECT
        sd.product_id,
        ds.sale_date,
        EXTRACT(ISODOW FROM ds.sale_date)::int as day_of_week,
        - (sd.quantity_sold + sd.quantity_lost) as estimated_demand
    FROM sale_details sd
    JOIN daily_sales ds ON ds.id = sd.daily_sale_id
),
ranked_demand AS (
    SELECT
        product_id,
        day_of_week,
        estimated_demand,
        ROW_NUMBER() OVER(PARTITION BY product_id, day_of_week ORDER BY sale_date DESC) as recency_rank
    FROM calculated_demand
)
SELECT
    product_id,
    day_of_week,
    FLOOR(
        SUM(
            CASE recency_rank
                WHEN 1 THEN estimated_demand * 0.40
                WHEN 2 THEN estimated_demand * 0.30
                WHEN 3 THEN estimated_demand * 0.20
                WHEN 4 THEN estimated_demand * 0.10
                ELSE 0
            END
        ) /
        NULLIF(SUM(
            CASE recency_rank
                WHEN 1 THEN 0.40
                WHEN 2 THEN 0.30
                WHEN 3 THEN 0.20
                WHEN 4 THEN 0.10
                ELSE 0
            END
        ), 0)
    )::int AS recommended_quantity
FROM ranked_demand
WHERE recency_rank <= 4
GROUP BY product_id, day_of_week;

CREATE UNIQUE INDEX IF NOT EXISTS idx_forecast_product_day
ON vw_daily_production_forecast(product_id, day_of_week);
