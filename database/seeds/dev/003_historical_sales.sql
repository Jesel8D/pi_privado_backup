-- ============================================================
-- TienditaCampus - DDL Seed: Test Data for Reports
-- This seed will insert active users, products, categories, 
-- and daily sales spanning multiple weeks to test reports.
-- ============================================================

-- 1. Create a Category
INSERT INTO categories (id, name, description, is_active)
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'Snacks Reportes', 
    'Categoría para pruebas de reportes', 
    true
) ON CONFLICT (name) DO NOTHING;

-- 2. Create a User (Seller)
INSERT INTO users (id, first_name, last_name, email, password_hash, role, is_active)
VALUES (
    '22222222-2222-2222-2222-222222222222', 
    'Vendedor',
    'Reportes', 
    'reportes@test.com', 
    '$argon2id$v=19$m=19456,t=2,p=1$XRUuqE0ogWq63N7OoWvWQw$DQu0wlT3bAhcnr5NF8TjXkgSP4xOrb/O2YhdV24GNLE', -- test1234
    'seller', 
    true
) ON CONFLICT (email) DO NOTHING;

-- 3. Create a Product
INSERT INTO products (id, seller_id, category_id, name, unit_cost, sale_price, is_perishable, is_active)
VALUES (
    '33333333-3333-3333-3333-333333333333', 
    '22222222-2222-2222-2222-222222222222', 
    '11111111-1111-1111-1111-111111111111', 
    'Papas Preparadas Test', 
    10.00, 
    25.00, 
    true, 
    true
) ON CONFLICT DO NOTHING;

-- 4. Create Historical Sales (Past 3 Weeks + Current Week)
-- Week -3
INSERT INTO daily_sales (id, seller_id, sale_date, total_investment, total_revenue, units_sold, units_lost, total_waste_cost, profit_margin, break_even_units, is_closed)
VALUES (
    '44444444-4444-4444-4444-000000000001', '22222222-2222-2222-2222-222222222222', (CURRENT_DATE - INTERVAL '21 days'), 
    200.00, 450.00, 18, 2, 20.00, 55.55, 13, true
);

-- Week -2
INSERT INTO daily_sales (id, seller_id, sale_date, total_investment, total_revenue, units_sold, units_lost, total_waste_cost, profit_margin, break_even_units, is_closed)
VALUES (
    '44444444-4444-4444-4444-000000000002', '22222222-2222-2222-2222-222222222222', (CURRENT_DATE - INTERVAL '14 days'), 
    200.00, 500.00, 20, 0, 0.00, 60.00, 13, true
);

-- Week -1
INSERT INTO daily_sales (id, seller_id, sale_date, total_investment, total_revenue, units_sold, units_lost, total_waste_cost, profit_margin, break_even_units, is_closed)
VALUES (
    '44444444-4444-4444-4444-000000000003', '22222222-2222-2222-2222-222222222222', (CURRENT_DATE - INTERVAL '7 days'), 
    300.00, 600.00, 24, 6, 60.00, 50.00, 20, true
);

-- Current Week
INSERT INTO daily_sales (id, seller_id, sale_date, total_investment, total_revenue, units_sold, units_lost, total_waste_cost, profit_margin, break_even_units, is_closed)
VALUES (
    '44444444-4444-4444-4444-000000000004', '22222222-2222-2222-2222-222222222222', CURRENT_DATE, 
    150.00, 375.00, 15, 0, 0.00, 60.00, 10, true
);

-- Refresh the materialized view after inserts so the reports can pick it up
REFRESH MATERIALIZED VIEW weekly_performance_mv;
