-- ============================================================
-- TienditaCampus - Verificación: Schema
-- ============================================================
-- Verifica que todas las tablas requeridas existen
-- ============================================================

DO $$
DECLARE
    required_tables TEXT[] := ARRAY[
        'users', 'categories', 'products', 
        'daily_sales', 'sale_details', 
        'inventory_records', 'weekly_reports'
    ];
    tbl TEXT;
    missing_tables TEXT[] := '{}';
BEGIN
    FOREACH tbl IN ARRAY required_tables
    LOOP
        IF NOT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = tbl
        ) THEN
            missing_tables := array_append(missing_tables, tbl);
        END IF;
    END LOOP;

    IF array_length(missing_tables, 1) > 0 THEN
        RAISE EXCEPTION '❌ Tablas faltantes: %', array_to_string(missing_tables, ', ');
    ELSE
        RAISE NOTICE '✅ Todas las tablas requeridas existen (% tablas)', array_length(required_tables, 1);
    END IF;
END
$$;
