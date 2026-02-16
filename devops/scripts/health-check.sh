#!/usr/bin/env bash
# ============================================================
# TienditaCampus - Health Check
# ============================================================
# Verifica el estado de todos los servicios
# Uso: bash devops/scripts/health-check.sh
# ============================================================

set -euo pipefail

echo "🏥 TienditaCampus - Health Check"
echo "================================"
echo ""

check_service() {
    local name="$1"
    local url="$2"
    local timeout="${3:-5}"

    printf "  %-12s " "$name:"
    if curl -sf --max-time "$timeout" "$url" > /dev/null 2>&1; then
        echo "✅ OK"
        return 0
    else
        echo "❌ DOWN"
        return 1
    fi
}

ERRORS=0

check_service "Nginx" "http://localhost:80/health" || ((ERRORS++))
check_service "Frontend" "http://localhost:3000" || ((ERRORS++))
check_service "Backend" "http://localhost:3001/api/health" || ((ERRORS++))

# PostgreSQL check via docker
printf "  %-12s " "Database:"
if docker exec tc-database pg_isready -U "${POSTGRES_USER:-postgres}" > /dev/null 2>&1; then
    echo "✅ OK"
else
    echo "❌ DOWN"
    ((ERRORS++))
fi

echo ""
if [ "$ERRORS" -eq 0 ]; then
    echo "🎉 Todos los servicios están funcionando correctamente"
else
    echo "⚠️  $ERRORS servicio(s) con problemas"
    exit 1
fi
