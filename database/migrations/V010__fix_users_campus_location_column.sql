-- Corrige desalineación entre columna legacy "campuslocation" y el nombre esperado "campus_location"
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'users'
          AND column_name = 'campuslocation'
    ) THEN
        ALTER TABLE public.users
            RENAME COLUMN campuslocation TO campus_location;
    ELSIF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'users'
          AND column_name = 'campus_location'
    ) THEN
        ALTER TABLE public.users
            ADD COLUMN campus_location VARCHAR(255) NULL;
    END IF;
END
$$;
