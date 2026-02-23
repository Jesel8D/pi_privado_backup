-- ============================================================
-- TienditaCampus - Migración V006: Documentación Enum Roles
-- ============================================================
-- Esta migración no altera la estructura de la base de datos 
-- ya que la tabla "users" creada en V001 tiene correctamente:
-- role user_role NOT NULL DEFAULT 'seller'
-- y el ENUM user_role soporta ('admin', 'seller', 'buyer').
--
-- PROPÓSITO:
-- A partir de esta versión, la plataforma usa explícitamente
-- la diferenciación de roles 'seller' y 'buyer'. El backend
-- está configurado para requerir este campo en el registro
-- o hacer fallback al valor por defecto 'seller' a nivel de TypeORM,
-- reflejando el DDL original de V001.
-- ============================================================

DO $$
BEGIN
    -- Validación de consistencia: asegurarse de que no haya usuarios
    -- con un rol fuera de los esperados
    -- (el tipo ENUM de PostgreSQL ya previene esto a nivel DB).
    NULL;
END
$$;
