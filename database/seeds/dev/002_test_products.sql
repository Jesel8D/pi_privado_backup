-- ============================================================
-- TienditaCampus - Seed DEV: Productos de Prueba
-- ============================================================
-- ⚠️ SOLO PARA DESARROLLO — No ejecutar en producción
-- ============================================================

-- Productos de prueba asociados al primer vendedor de prueba
WITH seller AS (
    SELECT id FROM users WHERE email = 'vendedor1@test.com' LIMIT 1
),
cat_frutas AS (
    SELECT id FROM categories WHERE name = 'Frutas Preparadas' LIMIT 1
),
cat_postres AS (
    SELECT id FROM categories WHERE name = 'Postres' LIMIT 1
),
cat_snacks AS (
    SELECT id FROM categories WHERE name = 'Snacks Empaquetados' LIMIT 1
)
INSERT INTO products (seller_id, category_id, name, description, unit_cost, sale_price, is_perishable, shelf_life_days) VALUES
    ((SELECT id FROM seller), (SELECT id FROM cat_frutas), 'Fresas con Crema', 'Porción de fresas frescas con crema y lechera', 14.50, 25.00, true, 1),
    ((SELECT id FROM seller), (SELECT id FROM cat_postres), 'Carlota de Limón', 'Rebanada de carlota de limón casera', 12.00, 20.00, true, 2),
    ((SELECT id FROM seller), (SELECT id FROM cat_postres), 'Pay de Queso', 'Rebanada de pay de queso artesanal', 15.00, 30.00, true, 2),
    ((SELECT id FROM seller), (SELECT id FROM cat_snacks), 'Sabritas Originales', 'Bolsa de Sabritas clásicas', 15.00, 22.00, false, null)
ON CONFLICT DO NOTHING;
