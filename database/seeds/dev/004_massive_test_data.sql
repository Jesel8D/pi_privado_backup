-- ============================================================
-- TienditaCampus - DDL Seed: Massive Test Data for Reports
-- Creación de usuarios (vendedor/comprador) y generación 
-- automatizada de 3 semanas de datos estadísticos
-- ============================================================

DO $$
DECLARE
    seller_uuid UUID;
    buyer_uuid UUID;
    cat_snack UUID;
    cat_dessert UUID;
    cat_drink UUID;
    prod1 UUID;
    prod2 UUID;
    prod3 UUID;
    
    d DATE;
    ds_id UUID;
    
    qty1 INT; sold1 INT; lost1 INT;
    qty2 INT; sold2 INT; lost2 INT;
    qty3 INT; sold3 INT; lost3 INT;
    
    inv_invest NUMERIC; inv_revenue NUMERIC;
    tot_waste NUMERIC;
    
    base_hash TEXT := '$argon2id$v=19$m=19456,t=2,p=1$XRUuqE0ogWq63N7OoWvWQw$DQu0wlT3bAhcnr5NF8TjXkgSP4xOrb/O2YhdV24GNLE';
BEGIN
    -- 1. VENDEDOR
    SELECT id INTO seller_uuid FROM users WHERE email = 'isaa@gmail.com';
    IF NOT FOUND THEN
        seller_uuid := gen_random_uuid();
        INSERT INTO users (id, first_name, last_name, email, password_hash, role, is_active)
        VALUES (seller_uuid, 'Vendedor', 'Maestro', 'isaa@gmail.com', base_hash, 'seller', true);
    ELSE
        UPDATE users SET password_hash = base_hash WHERE id = seller_uuid;
    END IF;

    -- 2. COMPRADOR
    SELECT id INTO buyer_uuid FROM users WHERE email = 'isaac@gmail.com';
    IF NOT FOUND THEN
        buyer_uuid := gen_random_uuid();
        INSERT INTO users (id, first_name, last_name, email, password_hash, role, is_active)
        VALUES (buyer_uuid, 'Comprador', 'Frecuente', 'isaac@gmail.com', base_hash, 'buyer', true);
    ELSE
        UPDATE users SET password_hash = base_hash WHERE id = buyer_uuid;
    END IF;
        
    -- 3. CATEGORIAS
    SELECT id INTO cat_snack FROM categories WHERE name = 'Botanas Saladas';
    IF NOT FOUND THEN
        cat_snack := gen_random_uuid();
        INSERT INTO categories (id, name, description, is_active) VALUES (cat_snack, 'Botanas Saladas', 'Papas, chicharrones, nachos', true);
    END IF;

    SELECT id INTO cat_dessert FROM categories WHERE name = 'Postres y Dulces';
    IF NOT FOUND THEN
        cat_dessert := gen_random_uuid();
        INSERT INTO categories (id, name, description, is_active) VALUES (cat_dessert, 'Postres y Dulces', 'Brownies, galletas, gomitas', true);
    END IF;

    SELECT id INTO cat_drink FROM categories WHERE name = 'Bebidas Refresh';
    IF NOT FOUND THEN
        cat_drink := gen_random_uuid();
        INSERT INTO categories (id, name, description, is_active) VALUES (cat_drink, 'Bebidas Refresh', 'Aguas, refrescos, chamoyadas', true);
    END IF;
    
    -- 4. PRODUCTOS
    SELECT id INTO prod1 FROM products WHERE name = 'Papas Locas Fuego' AND seller_id = seller_uuid;
    IF NOT FOUND THEN
        prod1 := gen_random_uuid();
        INSERT INTO products (id, seller_id, category_id, name, unit_cost, sale_price, is_perishable, shelf_life_days, is_active) 
        VALUES (prod1, seller_uuid, cat_snack, 'Papas Locas Fuego', 10.00, 25.00, true, 2, true);
    END IF;

    SELECT id INTO prod2 FROM products WHERE name = 'Brownie de Chocolate' AND seller_id = seller_uuid;
    IF NOT FOUND THEN
        prod2 := gen_random_uuid();
        INSERT INTO products (id, seller_id, category_id, name, unit_cost, sale_price, is_perishable, shelf_life_days, is_active) 
        VALUES (prod2, seller_uuid, cat_dessert, 'Brownie de Chocolate', 8.00, 20.00, true, 3, true);
    END IF;

    SELECT id INTO prod3 FROM products WHERE name = 'Agua de Horchata 1L' AND seller_id = seller_uuid;
    IF NOT FOUND THEN
        prod3 := gen_random_uuid();
        INSERT INTO products (id, seller_id, category_id, name, unit_cost, sale_price, is_perishable, shelf_life_days, is_active) 
        VALUES (prod3, seller_uuid, cat_drink, 'Agua de Horchata 1L', 5.00, 15.00, false, null, true);
    END IF;
    
    -- Limpiar data generada previamente para asegurar integridad
    DELETE FROM daily_sales WHERE seller_id = seller_uuid;
    DELETE FROM inventory_records WHERE seller_id = seller_uuid;
    DELETE FROM daily_inventory_snapshots WHERE seller_id = seller_uuid;

    -- 5. Bucle forzado de 21 días (3 semanas: 2 pasadas + actual)
    FOR i IN 0..21 LOOP
        d := CURRENT_DATE - (21 - i);
        ds_id := gen_random_uuid();
        
        -- Aleatorización
        qty1 := floor(random() * 11 + 20)::int; 
        sold1 := floor(random() * 11 + 15)::int;
        IF sold1 > qty1 THEN sold1 := qty1; END IF;
        lost1 := floor(random() * 4)::int;
        IF (sold1 + lost1) > qty1 THEN lost1 := qty1 - sold1; END IF;
        
        qty2 := floor(random() * 11 + 15)::int; 
        sold2 := floor(random() * 11 + 10)::int;
        IF sold2 > qty2 THEN sold2 := qty2; END IF;
        lost2 := floor(random() * 3)::int;
        IF (sold2 + lost2) > qty2 THEN lost2 := qty2 - sold2; END IF;
        
        qty3 := floor(random() * 11 + 30)::int; 
        sold3 := floor(random() * 11 + 25)::int;
        IF sold3 > qty3 THEN sold3 := qty3; END IF;
        lost3 := floor(random() * 2)::int;
        IF (sold3 + lost3) > qty3 THEN lost3 := qty3 - sold3; END IF;

        inv_invest := (qty1 * 10) + (qty2 * 8) + (qty3 * 5);
        inv_revenue := (sold1 * 25) + (sold2 * 20) + (sold3 * 15);
        tot_waste := (lost1 * 10) + (lost2 * 8) + (lost3 * 5);
        
        -- Insertar Daily Sale
        INSERT INTO daily_sales (id, seller_id, sale_date, total_investment, total_revenue, units_sold, units_lost, total_waste_cost, profit_margin, break_even_units, is_closed)
        VALUES (
            ds_id, seller_uuid, d, 
            inv_invest, inv_revenue, 
            (sold1 + sold2 + sold3), (lost1 + lost2 + lost3),
            tot_waste,
            CASE WHEN inv_revenue > 0 THEN ((inv_revenue - inv_invest)/inv_revenue)*100 ELSE 0 END,
            (inv_invest / NULLIF(((inv_revenue/(sold1+sold2+sold3)) - (inv_invest/(qty1+qty2+qty3))), 0)),
            true
        );
        
        -- Insertar Detalles (Sale details)
        INSERT INTO sale_details (daily_sale_id, product_id, quantity_prepared, quantity_sold, quantity_lost, waste_reason, waste_cost, unit_cost, unit_price) VALUES
        (ds_id, prod1, qty1, sold1, lost1, CASE WHEN lost1 > 0 THEN 'expired'::waste_reason_type ELSE NULL END, lost1 * 10.00, 10.00, 25.00),
        (ds_id, prod2, qty2, sold2, lost2, CASE WHEN lost2 > 0 THEN 'damaged'::waste_reason_type ELSE NULL END, lost2 * 8.00, 8.00, 20.00),
        (ds_id, prod3, qty3, sold3, lost3, CASE WHEN lost3 > 0 THEN 'other'::waste_reason_type ELSE NULL END, lost3 * 5.00, 5.00, 15.00);
        
        -- Insertar Snapshots
        INSERT INTO daily_inventory_snapshots (seller_id, product_id, snapshot_date, opening_stock, units_sold, units_wasted, closing_stock, waste_value) VALUES
        (seller_uuid, prod1, d, qty1, sold1, lost1, qty1 - sold1 - lost1, lost1 * 10.00),
        (seller_uuid, prod2, d, qty2, sold2, lost2, qty2 - sold2 - lost2, lost2 * 8.00),
        (seller_uuid, prod3, d, qty3, sold3, lost3, qty3 - sold3 - lost3, lost3 * 5.00);

        -- Para HOY (el último día del ciclo), creamos registros de inventario activos (solo si i = 21)
        IF i = 21 THEN
            INSERT INTO inventory_records (seller_id, product_id, record_date, quantity_initial, quantity_remaining, investment_amount, status) VALUES
            (seller_uuid, prod1, d, qty1, qty1 - sold1 - lost1, qty1 * 10.00, 'active'),
            (seller_uuid, prod2, d, qty2, qty2 - sold2 - lost2, qty2 * 8.00, 'active'),
            (seller_uuid, prod3, d, qty3, qty3 - sold3 - lost3, qty3 * 5.00, 'active');
        END IF;

    END LOOP;
END $$;

-- Refrescar la vista
REFRESH MATERIALIZED VIEW weekly_performance_mv;
