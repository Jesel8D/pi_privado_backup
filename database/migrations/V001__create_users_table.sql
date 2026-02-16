-- ============================================================
-- TienditaCampus - Migración V001: Tabla de Usuarios
-- ============================================================
-- Tabla normalizada con campos de trazabilidad UX y auditoría
-- Contraseñas hasheadas con Argon2 en la capa de aplicación
-- ============================================================

-- ── Tipo ENUM para roles ────────────────────────────────────
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'seller', 'buyer');
    END IF;
END
$$;

-- ── Tabla de usuarios ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    -- Identificación
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email                   VARCHAR(255) UNIQUE NOT NULL,
    password_hash           VARCHAR(255) NOT NULL,

    -- Datos personales
    first_name              VARCHAR(100) NOT NULL,
    last_name               VARCHAR(100) NOT NULL,
    phone                   VARCHAR(20),
    avatar_url              VARCHAR(500),

    -- Rol y estado
    role                    user_role NOT NULL DEFAULT 'seller',
    is_active               BOOLEAN NOT NULL DEFAULT true,
    is_email_verified       BOOLEAN NOT NULL DEFAULT false,

    -- Trazabilidad UX
    last_login_at           TIMESTAMP WITH TIME ZONE,
    login_count             INTEGER NOT NULL DEFAULT 0,

    -- Seguridad: Account Lockout
    failed_login_attempts   INTEGER NOT NULL DEFAULT 0,
    locked_until            TIMESTAMP WITH TIME ZONE,
    password_changed_at     TIMESTAMP WITH TIME ZONE,

    -- Auditoría
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ── Índices ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_email_active ON users(email, is_active);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- ── Trigger para updated_at ─────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
