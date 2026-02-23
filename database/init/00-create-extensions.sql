-- TienditaCampus - Extensiones de Base de Datos
-- Este script se ejecuta al inicio para asegurar que las extensiones requeridas estén disponibles.

-- Habilitar pg_stat_statements para benchmarking
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Habilitar pgcrypto para hashing si es necesario
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Habilitar uuid-ossp para IDs universales
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
