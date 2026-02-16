#!/usr/bin/env bash
# ============================================================
# TienditaCampus - Ejecutar Seeds
# ============================================================
# Uso: bash database/scripts/run-seeds.sh [--dev]
#   --dev: Incluye datos de prueba (usuarios y productos ficticios)
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$DB_ROOT/.." && pwd)"
SEEDS_DIR="$DB_ROOT/seeds"
INCLUDE_DEV=false

# Parsear argumentos
for arg in "$@"; do
    case $arg in
        --dev) INCLUDE_DEV=true ;;
    esac
done

# Cargar variables de entorno
if [ -z "${POSTGRES_USER:-}" ]; then
    if [ -f "$PROJECT_ROOT/.env" ]; then
        export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
    fi
fi

echo "🌱 Ejecutando seeds..."

# Seeds base (producción)
for seed in "$SEEDS_DIR"/[0-9]*.sql; do
    if [ -f "$seed" ]; then
        filename=$(basename "$seed")
        echo "  ➜ $filename"
        docker exec -i tc-database psql \
            -U "${POSTGRES_USER}" \
            -d "${POSTGRES_DB}" \
            -f - < "$seed" 2>&1 | grep -v "^$" || true
    fi
done

# Seeds de desarrollo (solo con --dev)
if [ "$INCLUDE_DEV" = true ]; then
    echo ""
    echo "🧪 Ejecutando seeds de desarrollo..."
    for seed in "$SEEDS_DIR"/dev/[0-9]*.sql; do
        if [ -f "$seed" ]; then
            filename=$(basename "$seed")
            echo "  ➜ [DEV] $filename"
            docker exec -i tc-database psql \
                -U "${POSTGRES_USER}" \
                -d "${POSTGRES_DB}" \
                -f - < "$seed" 2>&1 | grep -v "^$" || true
        fi
    done
fi

echo "✅ Seeds completados"
