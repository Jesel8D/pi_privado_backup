#!/usr/bin/env bash
# ============================================================
# TienditaCampus - Setup Environment
# ============================================================
# Crea el archivo .env a partir de .env.example
# Uso: bash devops/scripts/setup-env.sh
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"
ENV_EXAMPLE="$PROJECT_ROOT/.env.example"

echo "🔧 TienditaCampus - Setup Environment"
echo "======================================"

if [ ! -f "$ENV_EXAMPLE" ]; then
    echo "❌ Error: No se encontró $ENV_EXAMPLE"
    exit 1
fi

if [ -f "$ENV_FILE" ]; then
    echo "⚠️  El archivo .env ya existe."
    read -p "¿Deseas sobreescribirlo? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "⏭️  Operación cancelada."
        exit 0
    fi
fi

cp "$ENV_EXAMPLE" "$ENV_FILE"
echo "✅ Archivo .env creado desde .env.example"
echo ""
echo "📌 Siguiente paso: ejecuta 'bash devops/scripts/generate-secrets.sh'"
echo "   para generar contraseñas seguras automáticamente."
