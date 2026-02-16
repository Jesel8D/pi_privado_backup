#!/usr/bin/env bash
# ============================================================
# TienditaCampus - Generador de Secretos
# ============================================================
# Genera contraseñas seguras usando openssl y las escribe en .env
# Uso: bash devops/scripts/generate-secrets.sh
# ============================================================
# ⚠️ IMPORTANTE: Este script MODIFICA el archivo .env
#    Nunca subas .env a Git (ya está en .gitignore)
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

echo "🔐 TienditaCampus - Generador de Secretos"
echo "=========================================="

# Verificar que openssl está disponible
if ! command -v openssl &> /dev/null; then
    echo "❌ Error: openssl no está instalado."
    echo "   Instálalo con: sudo apt install openssl"
    exit 1
fi

# Verificar que .env existe
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: No se encontró $ENV_FILE"
    echo "   Primero ejecuta: bash devops/scripts/setup-env.sh"
    exit 1
fi

# ── Funciones ────────────────────────────────────────────────
generate_password() {
    openssl rand -base64 32 | tr -d '/+=' | cut -c1-24
}

generate_secret() {
    openssl rand -hex 64
}

generate_username() {
    echo "tc_user_$(openssl rand -hex 4)"
}

# ── Generar valores ──────────────────────────────────────────
POSTGRES_USER=$(generate_username)
POSTGRES_PASSWORD=$(generate_password)
JWT_SECRET=$(generate_secret)

echo ""
echo "📝 Generando secretos seguros..."
echo ""

# ── Escribir en .env ─────────────────────────────────────────
# Reemplazar valores vacíos con los generados
sed -i "s|^POSTGRES_USER=.*|POSTGRES_USER=${POSTGRES_USER}|" "$ENV_FILE"
sed -i "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=${POSTGRES_PASSWORD}|" "$ENV_FILE"
sed -i "s|^JWT_SECRET=.*|JWT_SECRET=${JWT_SECRET}|" "$ENV_FILE"

echo "✅ Secretos generados exitosamente:"
echo ""
echo "   POSTGRES_USER     = ${POSTGRES_USER}"
echo "   POSTGRES_PASSWORD = ${POSTGRES_PASSWORD:0:8}********"
echo "   JWT_SECRET        = ${JWT_SECRET:0:16}..."
echo ""
echo "🔒 Los valores completos están en: $ENV_FILE"
echo "⚠️  NUNCA compartas ni subas este archivo a Git"
