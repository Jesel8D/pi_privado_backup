#!/usr/bin/env bash
# ============================================================
# TienditaCampus - Script de Despliegue
# ============================================================
# Despliega la aplicación en producción
# Uso: bash devops/scripts/deploy.sh
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🚀 TienditaCampus - Despliegue"
echo "==============================="

# Verificar que .env existe
if [ ! -f "$PROJECT_ROOT/.env" ]; then
    echo "❌ Error: No se encontró .env"
    echo "   Ejecuta primero:"
    echo "   bash devops/scripts/setup-env.sh"
    echo "   bash devops/scripts/generate-secrets.sh"
    exit 1
fi

echo ""
echo "📦 Paso 1: Construyendo imágenes..."
docker compose -f "$PROJECT_ROOT/docker-compose.yml" \
               -f "$PROJECT_ROOT/docker-compose.prod.yml" \
               build --no-cache

echo ""
echo "🔄 Paso 2: Deteniendo servicios anteriores..."
docker compose -f "$PROJECT_ROOT/docker-compose.yml" \
               -f "$PROJECT_ROOT/docker-compose.prod.yml" \
               down

echo ""
echo "💾 Paso 3: Creando backup pre-despliegue..."
bash "$SCRIPT_DIR/backup-db.sh" 2>/dev/null || echo "⚠️  No se pudo crear backup (BD posiblemente no existía)"

echo ""
echo "🚀 Paso 4: Levantando servicios..."
docker compose -f "$PROJECT_ROOT/docker-compose.yml" \
               -f "$PROJECT_ROOT/docker-compose.prod.yml" \
               up -d

echo ""
echo "⏳ Paso 5: Esperando a que los servicios estén listos..."
sleep 15

echo ""
echo "🏥 Paso 6: Verificando estado..."
bash "$SCRIPT_DIR/health-check.sh"

echo ""
echo "✅ Despliegue completado exitosamente"
