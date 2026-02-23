# Guía de Entrega y Configuración de Benchmarking

Esta guía detalla los pasos para sincronizar el código trabajado localmente hacia tus 3 repositorios individuales de GitHub (Frontend, Backend y Database), así como las configuraciones necesarias de Google Cloud para que funcione el módulo de Benchmarking exigido en la evaluación.

---

## PARTE 1: Cómo actualizar tus 3 repositorios en GitHub

Dado que hemos estado trabajando todas las correcciones dentro de la carpeta unificada (`pi_privado_backup`), necesitas transferir estos cambios a tus 3 repositorios oficiales antes de que el profesor te evalúe. Así es como lo hemos estado haciendo:

### Paso 1: Bajar las actualizaciones (Hacer un Pull)
Abre la terminal de tu computadora y navega hasta la carpeta de **CADA UNO** de tus repositorios clonados (los que sí están enlazados a tus repositorios finales de GitHub). Antes de pegar el código nuevo, asegúrate de que están actualizados:

```bash
git fetch
git pull origin main
```
*(Repite esto en tu carpeta del repo Frontend, en la del Backend y en la de Database).*

### Paso 2: Copiar el código nuevo
Ve a tu carpeta de trabajo actual (`pi_privado_backup`) y copia el contenido a tus repositorios correspondientes:
1. **Frontend:** Copia todo el contenido de la carpeta `frontend` (de `pi_privado_backup`) y pégalo/reemplázalo en tu repositorio de GitHub de Frontend.
2. **Backend:** Copia todo el contenido de la carpeta `backend` y pégalo en tu repositorio de GitHub de Backend.
3. **Database:** Copia los scripts SQL (que están en `database/init`) y pégalos en tu repositorio de Database. Además, si en el repo de Database tienes configuraciones generales (como el `docker-compose.yml`), asegúrate de llevártelo también.

### Paso 3: Hacer el Commit y el Push
En la terminal, métete individualmente a cada una de estas 3 carpetas de repositorios (ya con los archivos nuevos) y ejecuta los siguientes comandos para subirlos a GitHub:

```bash
# Agrega todos los archivos nuevos y modificados
git add .

# Crea el comentario de la entrega
git commit -m "feat: Corrección de contraste en inputs y ampliación de body size a 50MB. Configuración de Benchmarking para GCP añadida."

# Sube los cambios a la nube
git push origin main
```
*(Haz estos tres comandos en la terminal de Frontend, luego en la de Backend y finalmente en la de Database).*

---

## PARTE 2: Configuración de Google Cloud y BigQuery

A continuación, están los pasos exactos para habilitar las funcionalidades solicitadas por el profesor en la Evaluación. Sin esto, la página te arrojará errores.

### 1. Solucionar el Error Rojo (Falta el Client ID de Google)
En tu captura, la consola dice: `"Google Client ID is missing"`. Esto impide que el botón de `"ENVIAR A BIGQUERY"` siquiera abra la ventana de inicio de sesión.

**Qué hacer:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un nuevo proyecto (o usa el que creaste para esta práctica).
3. En el menú, ve a **APIs y servicios > Credenciales**.
4. Crea un **ID de cliente de OAuth 2.0** (Tipo de aplicación: Aplicación web).
5. En *Orígenes autorizados de JavaScript*, añade `http://localhost:8080` y `http://localhost:3000`.
6. Copia el **ID de cliente generado** (es un código largo que termina en `.apps.googleusercontent.com`).
7. Abre el archivo `.env` en tu computadora (en la carpeta principal del frontend o raíz) y añade esta línea:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=codigo_que_copiaste_aqui.apps.googleusercontent.com
   ```
8. Reinicia los contenedores y el mensaje de error rojo desaparecerá.

### 2. Configurar la tabla de BigQuery
El profesor exige que el sistema inserte los diagnósticos en BigQuery de forma automática, validando tu inicio de sesión de Google. El código ya sabe exportar los datos, pero debes crear el "almacén" donde Google los va a recibir.

**Qué hacer:**
1. En tu misma consola de Google Cloud, busca **BigQuery**.
2. Asegúrate de tener habilitada la **"BigQuery API"**.
3. Crea un **Conjunto de datos (Dataset)** llamado `benchmarking_warehouse`.
4. Abre la terminal de consultas de BigQuery y pega la estructura exacta que pide el profesor para crear la tabla destino:

```sql
CREATE TABLE `tu-id-de-proyecto-en-google.benchmarking_warehouse.daily_query_metrics` (
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
*(**Ojo:** Cambia `tu-id-de-proyecto-en-google` por el ID real que aparece en la parte de arriba de tu consola de GCP).*

**Ajuste en el código del servidor:** Actualmente, el código del backend está intentando enviar los datos al proyecto `"data-from-software"` (como dice el PDF/MD del profe). Si tu proyecto no se llama así en Google, tienes que ir a cambiar la línea `70` del archivo `benchmarking.service.ts` a tu ID real de GCP.

### 3. Insertar Consultas de "Estrés" en tu Base de Datos Local
El botón amarillo de `"ESTRESAR SISTEMA"` sirve para que el profesor vea que recolectas información. Este botón recorre la tabla queries y lanza comandos masivos a PostgreSQL para "cansarlo" y que guarde los registros en `pg_stat_statements`.

**Qué hacer:** 
Antes de intentar hacer el "Corte del Día", necesitas utilizar un software como DBeaver (o la terminal) para conectarte a tu base de datos postgreSQL de Docker (puerto `5432`) e insertar datos de prueba reales para evaluar:

```sql
INSERT INTO queries (project_id, query_description, query_sql, target_table, query_type)
VALUES 
(1, 'Buscar usuarios inactivos', 'SELECT * FROM users WHERE "isActive" = false', 'users', 'SIMPLE_SELECT'),
(1, 'Contar productos caros', 'SELECT COUNT(*) FROM products WHERE "salePrice" > 100', 'products', 'AGGREGATION');
```

---

## Flujo Diario Resumido que debes de presentar al profesor:

1. **Abres** la página *Benchmarking* de TienditaCampus.
2. **Das clic** repetidas veces en "Ejecutar Queries" para generar datos estadísticos localmente.
3. Le **das a "Enviar a BigQuery"**. Se abrirá la ventana de Google para elegir tu sesión (porque configuraste tu `.env`).
4. **El backend mandará** el JSON de estadísticas directo a GCP y limpiará tu historial PostgreSQL (`pg_stat_statements_reset()`) dejándolo en cero para el día siguiente de forma automática de acuerdo a los requerimientos de la unidad.
