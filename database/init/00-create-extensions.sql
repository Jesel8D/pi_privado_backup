-- ============================================================
-- TienditaCampus - Extensiones PostgreSQL
-- ============================================================
-- Ejecutado automáticamente al crear la BD por primera vez
-- ============================================================

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Funciones criptográficas (hashing de contraseñas)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Búsqueda de texto completo mejorada
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
