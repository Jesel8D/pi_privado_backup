-- ============================================================
-- TienditaCampus - Seed: Admin del Sistema
-- ============================================================
-- Datos iniciales necesarios para el funcionamiento de la app
-- La contraseña está hasheada con Argon2id (generada en la capa de aplicación)
-- ⚠️ CAMBIAR la contraseña del admin en el primer login
-- ============================================================

-- Contraseña original: 'changeme_on_first_login' (hasheada con Argon2id)
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, is_email_verified)
VALUES (
    'admin@tienditacampus.com',
    '$argon2id$v=19$m=19456,t=2,p=1$mzCGm6EtyziH91cAdXFS4A$qdtHTuhVKAXCtGyYd123Tlbp8OL0PiNHcqLVmou4yXU',
    'Admin',
    'Sistema',
    'admin',
    true,
    true
)
ON CONFLICT (email) DO NOTHING;
