#!/usr/bin/env bash
# ============================================================
# TienditaCampus - Backup de BD (desde carpeta database)
# ============================================================
# Wrapper que invoca el script principal de DevOps
# Uso: bash database/scripts/backup.sh
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

bash "$PROJECT_ROOT/devops/scripts/backup-db.sh"
