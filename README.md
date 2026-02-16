# 🏪 TienditaCampus

> Herramientas Digitales para Vendedores Universitarios — Universidad Politécnica de Chiapas

Aplicación Web Progresiva (PWA) diseñada para ayudar a vendedores universitarios a entender su rentabilidad real, reducir pérdidas de productos perecederos y tomar mejores decisiones de inventario.

## 🏗️ Arquitectura

Arquitectura Orientada a Servicios (SOA) con 4 servicios desacoplados:

| Servicio | Tecnología | Puerto |
|----------|-----------|--------|
| Frontend | Next.js 14 (PWA) | 3000 |
| Backend | NestJS | 3001 |
| Database | PostgreSQL 16 | 5432 |
| Proxy | Nginx | 80/443 |

## 🚀 Inicio Rápido

### Prerequisitos
- Docker v20+ y Docker Compose v2+
- Node.js 20+ (para desarrollo local sin Docker)

### Configuración

```bash
# 1. Clonar el repositorio
git clone <repo-url> && cd proyecto_integrador

# 2. Generar archivo .env con secretos seguros
cp .env.example .env
bash devops/scripts/generate-secrets.sh

# 3. Levantar en desarrollo
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# 4. Acceder
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001/api
```

### Producción

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📁 Estructura del Proyecto

```
proyecto_integrador/
├── devops/          # Docker, scripts, CI/CD, monitoreo
├── database/        # Migraciones, seeds, roles, verificaciones
├── backend/         # NestJS API REST
├── frontend/        # Next.js 14 PWA
└── docs/            # Documentación del proyecto
```

## 🔒 Seguridad

- ✅ Cero credenciales hardcodeadas
- ✅ Variables de entorno via `.env` (nunca versionado)
- ✅ Scripts `.sh` para generación automática de secretos
- ✅ Roles PostgreSQL separados (admin, user, readonly)
- ✅ Docker Secrets en producción

## 📖 Documentación

- [Arquitectura SOA](docs/architecture/SOA-overview.md)
- [Guía de Desarrollo](docs/guides/setup-development.md)
- [API Endpoints](docs/api/endpoints.md)
- [Diagrama ER](database/docs/ER-diagram.md)

## 👥 Equipo

Universidad Politécnica de Chiapas — Proyecto Integrador
