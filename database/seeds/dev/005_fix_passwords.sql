UPDATE users 
SET 
  password_hash = '$argon2id$v=19$m=65536,t=3,p=4$qSuY1qqm9utnhs3qdCzRZgg$6fwi7RJ2DyjCxS7Zoo8XmiwbrQ9uEly214HevjQp92A',
  failed_login_attempts = 0,
  locked_until = NULL
WHERE email IN ('isaa@gmail.com', 'isaac@gmail.com');
