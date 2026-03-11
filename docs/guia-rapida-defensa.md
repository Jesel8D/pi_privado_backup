# Guía Rápida de Archivos Backend - Defensa

## 🎯 **ARCHIVOS QUE DEBES CONOCER A LA PERFECCIÓN**

---

### **🔥 ARCHIVOS ESENCIALES (Menciona estos)**

#### **1. `backend/src/main.ts`**
- **¿Qué es?** Punto de entrada de la aplicación
- **¿Por qué importa?** Configura todo: CORS, validación, límites de archivos
- **¿Qué decir?** "Aquí configuramos el middleware global, CORS para el frontend, y validación automática de DTOs"

#### **2. `backend/src/config/database.config.ts`**
- **¿Qué es?** Configuración de TypeORM con PostgreSQL
- **¿Por qué importa?** **¡CRUCIAL!** Habilita `pg_stat_statements` para benchmarking
- **¿Qué decir?** "Habilitamos pg_stat_statements para recolectar métricas de queries del sistema"

#### **3. `backend/src/modules/benchmarking/benchmarking.service.ts`**
- **¿Qué es?** **CORAZÓN DEL SISTEMA** - Servicio de análisis de rendimiento
- **¿Por qué importa?** Recolecta métricas, exporta a BigQuery, genera snapshots
- **¿Qué decir?** "Este servicio recolecta métricas de rendimiento de la base de datos usando pg_stat_statements y las exporta a BigQuery para análisis avanzado"

#### **4. `backend/src/modules/benchmarking/auth/oauth-bigquery.service.ts`**
- **¿Qué es?** Autenticación OAuth2 con Google Cloud
- **¿Por qué importa?** Permite acceso seguro a BigQuery y Google APIs
- **¿Qué decir?** "Implementamos OAuth 2.0 para autenticación segura con Google Cloud y acceso a BigQuery"

#### **5. `backend/src/modules/sales/sales.service.ts`**
- **¿Qué es?** Lógica de negocio principal de ventas
- **¿Por qué importa?** Calcula métricas en tiempo real, usa predicciones IQR
- **¿Qué decir?** "Aquí implementamos la lógica de negocio con cálculo de ROI, profit margins y predicciones usando método IQR"

#### **6. `backend/src/modules/sales/sales.repository.ts`**
- **¿Qué es?** Acceso a datos optimizado con vistas materializadas
- **¿Por qué importa?** Contiene consultas SQL complejas y análisis de rendimiento
- **¿Qué decir?** "Usamos vistas materializadas y consultas optimizadas para análisis de rendimiento de productos"

---

### **🗄️ ARCHIVOS DE BASE DE DATOS**

#### **7. `database/migrations/V017__create_export_views.sql`**
- **¿Qué es?** Vistas SQL para exportación de métricas
- **¿Por qué importa?** Contiene consultas complejas de análisis de rendimiento
- **¿Qué decir?** "Creamos vistas optimizadas para análisis de queries y exportación a BigQuery"

#### **8. `backend/src/modules/sales/entities/daily-sale.entity.ts`**
- **¿Qué es?** Entidad principal de ventas diarias
- **¿Por qué importa?** Almacena métricas calculadas automáticamente
- **¿Qué decir?** "Esta entidad almacena métricas calculadas como profit margin y break-even units"

---

### **⚙️ ARCHIVOS DE CONFIGURACIÓN**

#### **9. `backend/src/app.module.ts`**
- **¿Qué es?** Módulo raíz que une todo el sistema
- **¿Por qué importa?** Define la arquitectura modular completa
- **¿Qué decir?** "Aquí importamos todos los módulos y configuramos la conexión a base de datos"

#### **10. `.env`**
- **¿Qué es?** Variables de entorno del sistema
- **¿Por qué importa?** Contiene credenciales y configuración segura
- **¿Qué decir?** "Configuramos credenciales de base de datos, OAuth de Google y conexión a BigQuery"

---

## 🎯 **FRASES CLAVE PARA DEFENSA**

### **Sobre Benchmarking:**
- "Implementamos pg_stat_statements para recolectar métricas de queries en tiempo real"
- "Exportamos datos a BigQuery para análisis masivo y machine learning"
- "Usamos vistas materializadas para cachear resultados complejos y mejorar rendimiento"

### **Sobre Base de Datos:**
- "Diseñamos esquema relacional optimizado con índices estratégicos"
- "Implementamos patrón repository con vistas materializadas para rendimiento"
- "Usamos transacciones ACID para garantizar integridad en operaciones concurrentes"

### **Sobre Arquitectura:**
- "Aplicamos arquitectura modular con separación clara de responsabilidades"
- "Implementamos OAuth 2.0 para integración segura con Google Cloud"
- "Usamos TypeORM con SQL nativo para consultas complejas optimizadas"

---

## 🚀 **DEMO RÁPIDA (3 minutos)**

```bash
# 1. Mostrar sistema healthy
docker compose ps

# 2. Probar endpoint de benchmarking
curl http://localhost:3001/api/benchmarking/metrics

# 3. Mostrar vistas en base de datos
docker exec database psql -U tienditacampus_user -d tienditacampus -c "SELECT * FROM vw_product_performance LIMIT 5;"

# 4. Explicar flujo OAuth
# (Mostrar navegador con login de Google)
```

---

## 📋 **ORDEN RECOMENDADO PARA EXPLICAR**

1. **main.ts** - "Punto de entrada y configuración global"
2. **database.config.ts** - "Conexión a PostgreSQL con pg_stat_statements"
3. **benchmarking.service.ts** - "Sistema de análisis de rendimiento"
4. **oauth-bigquery.service.ts** - "Integración con Google Cloud"
5. **sales.service.ts** - "Lógica de negocio y métricas"
6. **sales.repository.ts** - "Acceso a datos optimizado"
7. **Vistas SQL** - "Consultas complejas para análisis"
8. **Entidades** - "Modelo de datos con métricas calculadas"

---

## 🎓 **PREGUNTAS FRECUENTES Y RESPUESTAS**

**P: ¿Para qué sirve pg_stat_statements?**
R: "Es una extensión de PostgreSQL que recolecta estadísticas de ejecución de todas las queries para análisis de rendimiento"

**P: ¿Por qué BigQuery?**
R: "Permite análisis de petabytes de datos con SQL estándar, ideal para tendencias temporales y machine learning"

**P: ¿Cómo optimizaron las consultas?**
R: "Identificamos queries lentas con pg_stat_statements, creamos índices específicos y vistas materializadas"

**P: ¿Qué pasa si falla Google OAuth?**
R: "Implementamos retry automático y fallback a almacenamiento local con reintentos programados"

---

## 🏆 **PUNTOS FUERTES A MENCIONAR**

- ✅ **Métricas en tiempo real** con pg_stat_statements
- ✅ **Análisis avanzado** con BigQuery y Google Cloud
- ✅ **Optimización de queries** con vistas materializadas
- ✅ **Seguridad** con OAuth 2.0 y cifrado
- ✅ **Escalabilidad** con arquitectura modular
- ✅ **Monitoreo** con health checks automáticos

**¡Con esto estás listo para una defensa profesional!** 🚀
