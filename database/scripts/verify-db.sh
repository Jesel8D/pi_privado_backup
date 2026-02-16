#!/usr/bin/env bash
# ============================================================
# TienditaCampus - Verificar Base de Datos
# ============================================================
# Ejecuta todas las verificaciones SQL
# Uso: bash database/scripts/verify-db.sh
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$DB_ROOT/.." && pwd)"
VERIFY_DIR="$DB_ROOT/verify"

# Cargar variables de entorno
if [ -z "${POSTGRES_USER:-}" ]; then
    if [ -f "$PROJECT_ROOT/.env" ]; then
        export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
    fi
fi

echo "🔍 Verificando base de datos..."
echo ""

ERRORS=0

for check in "$VERIFY_DIR"/check-*.sql; do
    if [ -f "$check" ]; then
        filename=$(basename "$check")
        echo "  🔎 $filename"
        if ! docker exec -i tc-database psql \
            -U "${POSTGRES_USER}" \
            -d "${POSTGRES_DB}" \
            -f - < "$check" 2>&1; then
            ((ERRORS++))
        fi
        echo ""
    fi
done

if [ "$ERRORS" -eq 0 ]; then
    echo "✅ Todas las verificaciones pasaron"
else
    echo "❌ $ERRORS verificación(es) fallaron"
    exit 1
fi
