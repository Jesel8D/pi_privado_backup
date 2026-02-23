#!/usr/bin/env bash
# ============================================================
# TienditaCampus - Backup de Base de Datos
# ============================================================
# Crea un backup comprimido de PostgreSQL
# Uso: bash devops/scripts/backup-db.sh
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKUP_DIR="$PROJECT_ROOT/database/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}.sql.gz"

echo "💾 TienditaCampus - Backup de Base de Datos"
echo "============================================"

# Verificar variables de entorno
if [ -z "${POSTGRES_USER:-}" ] || [ -z "${POSTGRES_DB:-}" ]; then
    echo "📂 Cargando variables desde .env..."
    if [ -f "$PROJECT_ROOT/.env" ]; then
        export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
    else
        echo "❌ Error: No se encontró .env ni variables de entorno configuradas"
        exit 1
    fi
fi

mkdir -p "$BACKUP_DIR"

echo "📦 Creando backup de '${POSTGRES_DB}'..."
docker exec tc-database pg_dump \
    -U "${POSTGRES_USER}" \
    -d "${POSTGRES_DB}" \
    --no-owner \
    --no-privileges \
    | gzip > "$BACKUP_FILE"

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo ""
echo "✅ Backup creado exitosamente"
echo "   📄 Archivo:  $BACKUP_FILE"
echo "   📏 Tamaño:   $BACKUP_SIZE"
echo ""
echo "💡 Para restaurar: bash devops/scripts/restore-db.sh $BACKUP_FILE"
