# 📄 Resumen de Sesión: Despliegue 3-Tier en AWS

Este documento resume el estado actual de la infraestructura, los comandos clave ejecutados y los problemas resueltos para mantener el contexto de la próxima sesión.

## 🏗️ Estado de la Infraestructura

### 1. Nivel de Base de Datos (DB)
- **Instancia:** `i-0bbd2a3ecd5858169` (base-de-d)
- **IP Pública:** `34.235.94.221`
- **IP Privada:** `172.31.69.124`
- **Estado:** **SALUDABLE**. PostgreSQL y MongoDB están corriendo en Docker.
- **Acceso:** Puertos `5432` y `27017` abiertos y mapeados al host. `pg_hba.conf` configurado para permitir conexiones desde la red interna (`172.31.0.0/16`).

### 2. Nivel de Backend (API)
- **Instancia:** `i-0bbd2a3ecd5858169` (TienditaCampus-Backend)
- **IP Pública:** `98.82.69.208`
- **IP Privada:** `172.31.73.241`
- **Estado:** **EN DEPURACIÓN**. NestJS conecta a la BD, pero falla al sincronizar tablas.
- **Configuración:** `NODE_ENV=development` para desactivar SSL obligatorio y habilitar sincronización.

### 3. Nivel de Frontend (Web)
- **Instancia:** `i-0a5003dda1ea6b075` (fronted-tienditacampus)
- **IP Pública:** `54.157.136.124`
- **IP Privada:** `172.31.78.6`
- **Estado:** **ACTIVO**. Docker instalado, Nginx configurado y Frontend construido (Next.js).
- **Acceso:** Puerto `80` abierto. Responde pero espera a que el Backend esté listo.

---

## 🔑 Credenciales y Llaves
- **Llave Backend/Frontend:** `CLAVE-CLAVES-INTEGRADOR.pem` (y la nueva `llaves-fronted-tiendita`)
- **Llave Base de Datos:** `clave-base-de-datos.pem`
- **Postgres (Superusuario):** `tc_admin` / `TienditaCampus2026!`
- **Postgres (Root sugerido):** `postgres` / `emico311006L` (o `emico311006L.`)

---

## 🛠️ Problemas Resueltos (Logros)
1.  **Puertos Docker:** Se corrigió el `docker-compose.yml` en la BD para exponer puertos al host.
2.  **Seguridad Postgres:** Se modificó `pg_hba.conf` para permitir tráfico entre instancias.
3.  **Bypass SSL:** Se forzó el Backend a modo `development` porque el Docker de Postgres no soporta SSL por defecto.
4.  **Propiedad de Esquema:** Se elevó a `tc_admin` a **Superusuario** y se recreó el esquema `public` para asegurar que tenga permisos de escritura.

---

## 🚧 Bloqueo Actual y Siguiente Paso
**Problema:** El Backend conecta a la base de datos pero "muere" silenciosamente o con errores de `DataSource.js` justo cuando intenta validar las tablas existentes.
**Siguiente Paso:** 
1.  Entrar a la instancia de Backend (`98.82.69.208`).
2.  Ejecutar `docker compose logs -f backend` para ver el error exacto en tiempo real.
3.  Si es necesario, borrar los volúmenes de la base de datos y dejar que TypeORM los cree desde cero con el esquema limpio que acabamos de preparar.

---

## 📂 Documentación Generada
- [Manual 3-Tier Detallado](file:///C:/Users/jaras/.gemini/antigravity/brain/611a2e38-0ec2-4ea9-af22-c5141e25e8bb/aws_3_tier_deployment_manual.md)
- [Lista de Tareas AWS](file:///C:/Users/jaras/.gemini/antigravity/brain/611a2e38-0ec2-4ea9-af22-c5141e25e8bb/task_aws_3_tier.md)
