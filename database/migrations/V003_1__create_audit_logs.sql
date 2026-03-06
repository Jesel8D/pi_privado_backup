-- ============================================================
-- TienditaCampus — Tabla de Auditoría con JSONB (NoSQL-style)
-- ============================================================
-- Esta tabla combina columnas relacionales (SQL) con una columna
-- JSONB (NoSQL) para almacenar metadata flexible sin esquema fijo.
--
-- Ejemplo de paradigma híbrido: SQL + NoSQL en PostgreSQL.
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- ── Columnas Relacionales (SQL) ──────────────────────
    action          VARCHAR(100) NOT NULL,           -- 'user.login', 'product.create'
    entity_type     VARCHAR(50),                     -- 'user', 'product', 'sale'
    entity_id       UUID,                            -- ID de la entidad afectada
    user_id         UUID,                            -- Quién hizo la acción
    level           VARCHAR(20) DEFAULT 'info',      -- 'info', 'warn', 'error'
    description     TEXT,                            -- Descripción legible
    ip_address      VARCHAR(45),                     -- IPv4 o IPv6
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    
    -- ── Columna NoSQL (JSONB) ────────────────────────────
    -- Esta columna puede almacenar CUALQUIER estructura JSON.
    -- No tiene esquema fijo — cada registro es diferente.
    -- Similar a un documento en MongoDB.
    metadata        JSONB DEFAULT '{}'::jsonb
);

-- ── Índices para búsquedas rápidas ─────────────────────────
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs (created_at DESC);

-- ── Índice GIN para búsquedas DENTRO del JSONB ────────────
-- Permite consultas como:
--   SELECT * FROM audit_logs WHERE metadata @> '{"role": "admin"}';
--   SELECT * FROM audit_logs WHERE metadata ->> 'email' = 'user@mail.com';
CREATE INDEX IF NOT EXISTS idx_audit_metadata ON audit_logs USING GIN (metadata);

-- ── Ejemplos de consultas JSONB ────────────────────────────
-- (No ejecutar, solo documentación)
--
-- Buscar todos los logins fallidos:
--   SELECT * FROM audit_logs WHERE action = 'user.login_failed' ORDER BY created_at DESC;
--
-- Buscar por email dentro del JSON:
--   SELECT * FROM audit_logs WHERE metadata ->> 'email' = '243697@ids.upchiapas.edu.mx';
--
-- Buscar logs donde el loginCount sea mayor a 5:
--   SELECT * FROM audit_logs WHERE (metadata ->> 'loginCount')::int > 5;
--
-- Buscar logs que contengan un campo específico:
--   SELECT * FROM audit_logs WHERE metadata ? 'failedAttempts';
--
-- Obtener solo el campo 'role' del metadata:
--   SELECT id, action, metadata -> 'role' AS role FROM audit_logs;
