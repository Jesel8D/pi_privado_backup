# FINAL_STACK_ERROR_REPORT

- **Fecha:** 2026-03-03
- **Intento final ejecutado:** 1 (único, según instrucción)
- **Resultado:** ❌ Falló el levantamiento completo

## Comandos ejecutados (validación única)
1. `docker compose down -v`
2. `docker compose up --build`

## Error principal
- **Servicio afectado:** `backend` del proyecto `tc_stack_dev`
- **Extracto corto:**
  - `failed to set up container networking`
  - `Bind for 0.0.0.0:3001 failed: port is already allocated`

## Causa probable
Existe otro stack previo aún activo ocupando el puerto `3001`:
- `tc-backend` (stack antiguo) expone `0.0.0.0:3001->3001`

## Estado posterior (resumido)
- `tc_stack_dev-database-1`: running (healthy)
- `tc_stack_dev-mongodb-1`: running (healthy)
- `tc_stack_dev-backend-1`: created (no inicia por conflicto de puerto)
- `tc_stack_dev-frontend-1`: created
- `tc_stack_dev-nginx-1`: created
- Stack legado aún activo: `tc-backend`, `tc-frontend`, `tc-nginx`, `tc-database`, `tc-mongodb`

## Recomendación puntual
Liberar el puerto `3001` deteniendo/eliminando el contenedor legado `tc-backend` (o cambiar `BACKEND_PORT` en `.env`) y luego ejecutar un nuevo `docker compose up --build` (fuera de esta ejecución, para respetar el límite de intento único solicitado).
