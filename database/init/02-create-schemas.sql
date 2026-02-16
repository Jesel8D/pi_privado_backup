-- ============================================================
-- TienditaCampus - Schemas
-- ============================================================
-- Organización lógica de la base de datos
-- ============================================================

-- Schema principal (ya existe por defecto)
-- public: tablas principales de la aplicación

-- Permisos en schema public
GRANT USAGE ON SCHEMA public TO tc_admin;
GRANT USAGE ON SCHEMA public TO tc_app;
GRANT USAGE ON SCHEMA public TO tc_readonly;

DO $$
BEGIN
    RAISE NOTICE 'Schemas y permisos configurados correctamente';
END $$;
