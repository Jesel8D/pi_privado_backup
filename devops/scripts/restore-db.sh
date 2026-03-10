#!/usr/bin/env bash
# ============================================================
# TienditaCampus - Restaurar Base de Datos
# ============================================================
# Restaura un backup de PostgreSQL
# Uso: bash devops/scripts/restore-db.sh <backup_file.sql.gz>
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🔄 TienditaCampus - Restaurar Base de Datos"
echo "============================================"

if [ -z "${1:-}" ]; then
    echo "❌ Error: Especifica el archivo de backup"
    echo "   Uso: bash devops/scripts/restore-db.sh <backup_file.sql.gz>"
    echo ""
    echo "   Backups disponibles:"
    ls -lh "$PROJECT_ROOT/database/backups/"*.sql.gz 2>/dev/null || echo "   (ninguno)"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: No se encontró el archivo $BACKUP_FILE"
    exit 1
fi

# Cargar variables de entorno
if [ -z "${POSTGRES_USER:-}" ] || [ -z "${POSTGRES_DB:-}" ]; then
    if [ -f "$PROJECT_ROOT/.env" ]; then
        export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
    else
        echo "❌ Error: No se encontró .env ni variables de entorno configuradas"
        exit 1
    fi
fi

echo "⚠️  ADVERTENCIA: Esto sobreescribirá la base de datos '${POSTGRES_DB}'"
read -p "¿Continuar? (s/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "⏭️  Operación cancelada."
    exit 0
fi

echo "📦 Restaurando desde: $BACKUP_FILE"
gunzip -c "$BACKUP_FILE" | docker exec -i tc-database psql \
    -U "${POSTGRES_USER}" \
    -d "${POSTGRES_DB}" \
    --quiet

echo ""
echo "✅ Base de datos restaurada exitosamente"
