#!/bin/sh
# ============================================================
# Hook de Inicialización Automática de Migraciones
# ============================================================
# Este script se ejecuta automáticamente por la imagen de PostgreSQL 
# durante el primer arranque cuando se monta en /docker-entrypoint-initdb.d/
#
# Lee el contenido del script original de migraciones y lo ejecuta 
# localmente en vez de via docker exec (porque YA estamos en el contenedor)

set -eu

echo "Levantando migraciones automáticas..."

MIGRATIONS_DIR="/migrations"

# Iterar sobre las migraciones en orden alfabético
for migration in "$MIGRATIONS_DIR"/V*.sql; do
    if [ -f "$migration" ]; then
        filename=$(basename "$migration")
        echo "  ➜ Preparando: $filename"
        # Usamos el usuario maestro y la DB por defecto ya exportados por la imagen de postgres
        psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -f "$migration"
    fi
done

echo "✅ Migraciones en el Container terminadas"
