# ============================================
# TienditaCampus - Database (PostgreSQL 16)
# ============================================

FROM postgres:16-alpine

# Instalar extensiones adicionales si es necesario
# Las extensiones se activan en init/00-create-extensions.sql

# Copiar scripts de inicialización
# PostgreSQL ejecuta automáticamente los archivos en /docker-entrypoint-initdb.d/
# en orden alfabético al crear la base de datos por primera vez
COPY init/ /docker-entrypoint-initdb.d/

# Configuración de PostgreSQL optimizada
# COPY postgresql.conf /etc/postgresql/postgresql.conf

EXPOSE 5432

HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
    CMD pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-tienditacampus}
