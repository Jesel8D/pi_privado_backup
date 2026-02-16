-- ============================================================
-- TienditaCampus - Seed DEV: Usuarios de Prueba
-- ============================================================
-- ⚠️ SOLO PARA DESARROLLO — No ejecutar en producción
-- Contraseñas hasheadas con Argon2id (generadas en la capa de aplicación)
-- ============================================================

-- Contraseña para todos los usuarios de prueba: 'test1234' (hasheada con Argon2id)
INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_email_verified) VALUES
    (
        'vendedor1@test.com',
        '$argon2id$v=19$m=19456,t=2,p=1$XRUuqE0ogWq63N7OoWvWQw$DQu0wlT3bAhcnr5NF8TjXkgSP4xOrb/O2YhdV24GNLE',
        'María', 'García', '9611234567', 'seller', true
    ),
    (
        'vendedor2@test.com',
        '$argon2id$v=19$m=19456,t=2,p=1$XRUuqE0ogWq63N7OoWvWQw$DQu0wlT3bAhcnr5NF8TjXkgSP4xOrb/O2YhdV24GNLE',
        'Carlos', 'López', '9617654321', 'seller', true
    ),
    (
        'comprador1@test.com',
        '$argon2id$v=19$m=19456,t=2,p=1$XRUuqE0ogWq63N7OoWvWQw$DQu0wlT3bAhcnr5NF8TjXkgSP4xOrb/O2YhdV24GNLE',
        'Ana', 'Hernández', '9619876543', 'buyer', true
    )
ON CONFLICT (email) DO NOTHING;
