# EVALUACIÓN - UNIDAD 2 - IMPLEMENTACIÓN DE BENCHMARKING

**Docente:** Horacio Irán Solís Cisneros  
**Puntos:** 100

---

## 1. Objetivo
Implementar la estructura de base de datos descrita, ejecutar pruebas controladas sobre el sistema y enviar periódicamente las métricas recolectadas a un almacén central en BigQuery utilizando autenticación OAuth con la cuenta Gmail registrada.

## 2. Estructura de Base de Datos (PostgreSQL)

Cada equipo debe crear las siguientes tablas exactamente como se describen. No se permite modificar nombres de columnas ni eliminar atributos.

### 2.1 Tabla: `projects`
Almacena la caracterización estructural de cada sistema.
```sql
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_type VARCHAR(20) NOT NULL CHECK (
        project_type IN ('ECOMMERCE', 'SOCIAL', 'FINANCIAL', 'HEALTHCARE', 'IOT', 
                         'EDUCATION', 'CONTENT', 'ENTERPRISE', 'LOGISTICS', 'GOVERNMENT')
    ),
    description TEXT,
    db_engine VARCHAR(20) NOT NULL CHECK (
        db_engine IN ('POSTGRESQL', 'MYSQL', 'MONGODB', 'OTHER')
    )
);
```

### 2.2 Tabla: `queries`
Define el catálogo de cargas de trabajo a evaluar.
```sql
CREATE TABLE queries (
    query_id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(project_id),
    query_description TEXT NOT NULL,
    query_sql TEXT NOT NULL,
    target_table VARCHAR(100),
    query_type VARCHAR(30) CHECK (
        query_type IN ('SIMPLE_SELECT', 'AGGREGATION', 'JOIN', 
                       'WINDOW_FUNCTION', 'SUBQUERY', 'WRITE_OPERATION')
    )
);
```

### 2.3 Tabla: `executions`
Almacena las métricas observadas en cada ejecución individual.
```sql
CREATE TABLE executions (
    execution_id BIGSERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(project_id),
    query_id INT REFERENCES queries(query_id),
    index_strategy VARCHAR(20) CHECK (
        index_strategy IN ('NO_INDEX', 'SINGLE_INDEX', 'COMPOSITE_INDEX')
    ),
    execution_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms BIGINT,
    records_examined BIGINT,
    records_returned BIGINT,
    dataset_size_rows BIGINT,
    dataset_size_mb NUMERIC,
    concurrent_sessions INT,
    shared_buffers_hits BIGINT,
    shared_buffers_reads BIGINT
);
```

---

## 3. Configuración del Motor PostgreSQL

1. **Habilitar extensión**:
   ```sql
   CREATE EXTENSION pg_stat_statements;
   ```
2. **Configuración en `postgresql.conf`**:
   Incluir la línea: `shared_preload_libraries = 'pg_stat_statements'`
3. **Reiniciar el servidor**.
4. **Verificar activación**:
   ```sql
   SELECT * FROM pg_stat_statements LIMIT 5;
   ```

---

## 4. Procedimiento Diario y Snapshot

### 4.1 Operación
* Durante el periodo de observación, ejecutar las consultas registradas en la tabla `queries`.
* No reiniciar estadísticas antes de generar el snapshot.

### 4.2 Generación del Snapshot Diario (Proceso Automatizado)
El proceso debe ejecutarse desde el backend (vía botón de "Corte del Día", proceso programado o disparador):
1. Consultar métricas consolidadas.
2. Serializar datos en JSON.
3. Enviar datos al almacén **BigQuery**.
4. Confirmar recepción exitosa.
5. Ejecutar `SELECT pg_stat_statements_reset();` **Solo si el envío fue exitoso**.

### 4.3 Estructura del Envío a BigQuery
El esquema de destino en BigQuery es:
```sql
CREATE TABLE `data-from-software.benchmarking_warehouse.daily_query_metrics` (
  project_id INT64 NOT NULL,
  snapshot_date DATE NOT NULL,
  queryid STRING,
  dbid INT64,
  userid INT64,
  query STRING,
  calls INT64,
  total_exec_time_ms FLOAT64,
  mean_exec_time_ms FLOAT64,
  min_exec_time_ms FLOAT64,
  max_exec_time_ms FLOAT64,
  stddev_exec_time_ms FLOAT64,
  rows_returned INT64,
  shared_blks_hit INT64,
  shared_blks_read INT64,
  shared_blks_dirtied INT64,
  shared_blks_written INT64,
  temp_blks_read INT64,
  temp_blks_written INT64,
  ingestion_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY snapshot_date
CLUSTER BY project_id, queryid;
```

---

## 5. Autenticación OAuth con Google

* El usuario inicia sesión con Google en la aplicación.
* La aplicación obtiene un `access_token`.
* El backend valida el token y lo usa para la inserción en BigQuery.
* **Scope requerido**: `https://www.googleapis.com/auth/bigquery`

---

## 6. Evaluación
Se calificará:
* Correcta implementación del modelo relacional.
* Configuración de `pg_stat_statements`.
* Calidad y consistencia de datos.
* Cumplimiento del flujo OAuth.
* Automatización del proceso.
