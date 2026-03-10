-- Update admin user password with proper bcrypt hash
-- Using proper escaping for PostgreSQL
UPDATE users
SET password_hash = '$2b$12$dIH3hqHWf9Tcw2CVQKSS2e4lQtgBpzml62oh6awtoPupXVBhSgEBG'
WHERE email = 'jarassanchezl@gmail.com';
