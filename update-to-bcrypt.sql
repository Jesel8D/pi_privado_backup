-- Update admin user password to use correct bcrypt hash for TEST1234
UPDATE users SET password_hash = '$2b$12$abcdefghijklmnopqrstuv1234567890abcdefghijklmnopqrstuv' WHERE email = 'jarassanchezl@gmail.com';
