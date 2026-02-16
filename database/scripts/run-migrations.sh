#!/usr/bin/env bash
# ============================================================
# TienditaCampus - Ejecutar Migraciones
# ============================================================
# Uso: bash database/scripts/run-migrations.sh
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$DB_ROOT/.." && pwd)"
MIGRATIONS_DIR="$DB_ROOT/migrations"

# Cargar variables de entorno
if [ -z "${POSTGRES_USER:-}" ]; then
    if [ -f "$PROJECT_ROOT/.env" ]; then
        export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
    fi
fi

echo "📦 Ejecutando migraciones..."

for migration in "$MIGRATIONS_DIR"/V*.sql; do
    if [ -f "$migration" ]; then
        filename=$(basename "$migration")
        echo "  ➜ $filename"
        docker exec -i tc-database psql \
            -U "${POSTGRES_USER}" \
            -d "${POSTGRES_DB}" \
            -f - < "$migration" 2>&1 | grep -v "^$" || true
    fi
done

echo "✅ Migraciones completadas"
