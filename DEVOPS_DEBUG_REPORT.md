# DEVOPS_DEBUG_REPORT

- **Fecha:** 2026-03-03
- **Resultado final:** ❌ No fue posible levantar el stack completo tras 3 intentos (límite alcanzado).

## Intentos realizados

### Intento 1
- **Comando:** `docker compose up --build`
- **Resultado:** Falló en build de `frontend`.
- **Extracto corto del error:**
  - `Failed to fetch 'Inter' from Google Fonts`
  - `target frontend: failed to solve ... RUN npm run build ... exit code: 1`

### Intento 2
- **Comandos:**
  1. `docker compose down -v`
  2. `docker compose up --build`
- **Resultado:** Build completó, pero falló creación de contenedor `database`.
- **Extracto corto del error:**
  - `Conflict. The container name "/tc-database" is already in use`

### Intento 3
- **Comandos:**
  1. `docker compose down -v`
  2. `docker system prune -f`
  3. `docker compose up --build`
- **Resultado:** Repite conflicto de nombre de contenedor.
- **Extracto corto del error:**
  - `Conflict. The container name "/tc-database" is already in use`

## Servicio que falló
- **database** (`tc-database`) durante fase de creación por conflicto de nombre.

## Logs relevantes revisados
- `docker compose logs --tail=120`
- `docker logs tc-database --tail=120`
- `docker ps -a --filter name=tc-database`

## Hallazgo técnico clave
- Existe un contenedor previo con nombre fijo `tc-database` ya corriendo:
  - `tc-database   Up ... (healthy)   proyecto_integrador-database`
- También aparecen avisos de red/volúmenes creados por otro proyecto (`proyecto_integrador`), indicando colisión de recursos compartidos entre proyectos.

## Posible causa técnica
1. Uso de `container_name` estático en `docker-compose.yml` (`tc-database`, etc.) combinado con otro stack existente con los mismos nombres.
2. Reutilización de recursos Docker (network/volumes) creados por otro project name.
3. En el primer intento además hubo timeout de red al descargar Google Fonts durante build de Next.js.

## Recomendación puntual de corrección
1. **Eliminar o renombrar `container_name`** en `docker-compose.yml` para evitar colisiones entre proyectos.
2. **Separar recursos por proyecto** (volúmenes/red con prefijos únicos o `external: true` explícito cuando se quiera compartir).
3. Para el build frontend en entornos con red restringida, **evitar dependencia runtime de Google Fonts durante build** (fuente local/fallback) para no bloquear `npm run build`.
