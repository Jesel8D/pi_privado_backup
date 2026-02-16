-- ============================================================
-- TienditaCampus - Roles de Base de Datos
-- ============================================================
-- Define roles con principio de mínimo privilegio
-- Las contraseñas se configuran vía variables de entorno
-- ============================================================

-- Rol administrador: gestión completa
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'tc_admin') THEN
        CREATE ROLE tc_admin WITH LOGIN CREATEDB;
        RAISE NOTICE 'Rol tc_admin creado';
    END IF;
END
$$;

-- Rol aplicación: lectura y escritura (usado por el backend)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'tc_app') THEN
        CREATE ROLE tc_app WITH LOGIN;
        RAISE NOTICE 'Rol tc_app creado';
    END IF;
END
$$;

-- Rol solo lectura: para reportes y monitoreo
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'tc_readonly') THEN
        CREATE ROLE tc_readonly WITH LOGIN;
        RAISE NOTICE 'Rol tc_readonly creado';
    END IF;
END
$$;

-- ── Permisos por defecto ────────────────────────────────────

-- tc_admin: acceso total
GRANT ALL PRIVILEGES ON DATABASE tienditacampus TO tc_admin;

-- tc_app: lectura y escritura en tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO tc_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO tc_app;

-- tc_readonly: solo lectura
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT ON TABLES TO tc_readonly;
