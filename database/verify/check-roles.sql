-- ============================================================
-- TienditaCampus - Verificación: Roles
-- ============================================================

SELECT 
    r.rolname AS role,
    r.rolcanlogin AS can_login,
    r.rolcreatedb AS can_create_db,
    r.rolsuper AS is_superuser
FROM pg_catalog.pg_roles r
WHERE r.rolname LIKE 'tc_%'
ORDER BY r.rolname;
