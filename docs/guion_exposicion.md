# Guion de Exposición: TienditaCampus 🚀

*(Este documento está diseñado como una guía paso a paso para que ustedes y su equipo lo expongan verbalmente con apoyo de diapositivas. Pueden repartirse los "Oradores".).*

---

## 🎙️ Intro: El Problema (Orador 1)

**[Inicio de la Exposición]**
"Buenos días a todos. Quienes hemos vendido algo aquí en la universidad, o hemos comprado comida entre clases, sabemos que la logística es un caos.
Muchos estudiantes emprenden para ayudarse con sus gastos diarios vendiendo sándwiches, postres o snacks. El problema es que se enfrentan a **mermas altísimas** porque sus productos se echan a perder rápido (son perecederos) y llevan el control en una libreta o simplemente 'al tanteo'.
Se estima que en México se desperdician 30 millones de toneladas de alimento al año. Y en nuestra pequeña escala universitaria, ese desperdicio significa dinero perdido para el estudiante.
Por eso creamos **TienditaCampus**: Un software de gestión, inventario y punto de venta diseñado EXCLUSIVAMENTE para las microeconomías universitarias."

---

## 🆚 Análisis de la Competencia e Innovación (Orador 2)

**[Cambio de diapositiva: Competidores]**
"Cuando empezamos a investigar, nos preguntamos: *¿Por qué no usan simplemente las apps que ya existen?* Investigamos el mercado en México y encontramos dos tipos de plataformas:

1.  **Sistemas POS Tradicionales (Square, Toast):** Son carísimos. Cobran comisiones de hasta 3% por transacción y mensualidades fijas. Un estudiante que vende tortas no tiene el margen de ganancia para pagar eso.
2.  **Apps Universitarias y de Rescate (FáciLUNCH, Infood, Too Good To Go):** Estas apps están de moda. *Infood* o *FáciLUNCH* ayudan a apartar comida en cafeterías establecidas. *Too Good To Go* ayuda a vender lo que sobró.

**La Diferencia de TienditaCampus:** Nosotros no somos una app de 'delivery' ni de sobras. Nosotros atacamos la raíz matemática del problema de inventario usando Estadística.
Implementamos el **Método del Rango Intercuartílico (IQR)** en el código para detectar anomalías en la venta. Si un día hay un evento y se vende el triple, el algoritmo limpia ese 'ruido' para no sobre-sugerir compras al día siguiente, reduciendo la merma pre-caducidad en un margen proyectado del 10%. Es estadística avanzada empaquetada en un software gratis para el estudiante."

---

## ⚖️ Marco Normativo y Legal (Orador 1 o 3)

**[Cambio de diapositiva: Leyes y Exigencias]**
"Desarrollar software que maneja comida y datos personales en México no es un juego, por lo que adaptamos nuestra plataforma a dos regulaciones clave:

1.  **Sanidad (NOM-251-SSA1-2009):** Esta norma regula la higiene en el proceso de alimentos. Como el estudiante maneja perecederos, nuestro software fuerza la metodología **FIFO (Primeras Entradas, Primeras Salidas)** en la base de datos de inventario. Así garantizamos que lo que caduca antes, se vende antes, cumpliendo con los estándares de salud pública.
2.  **Privacidad de Datos (LFPDPPP):** Manejamos nombres, correos y reportes financieros. Por cumplimiento legal y para facilitar el acceso, integramos **Google SSO (Single Sign-On)**. En lugar de guardar y arriesgar contraseñas, Google hace la validación segura de identidad, y nosotros solo vinculamos el token a nuestra base de datos, respetando la privacidad del usuario al máximo."

---

## 💻 ¿Cómo lo desarrollamos? Arquitectura (Orador 4 o Rol Técnico)

**[Cambio de diapositiva: Tecnologías]**
"Ahora, ¿cómo pasamos esto a la realidad? Construimos el sistema como un 'Monorepo' profesional, corriendo bajo **Docker Compose** para asegurar que el ambiente de despliegue sea inmutable.

*   **Frontend (Lo visual):** Usamos **React.js y Next.js 14**. Necesitábamos que la interfaz fuera rápida para celulares (SSR - Server Side Rendering). Le dimos un diseño *Dark Luxury* moderno con TailwindCSS con alertas dinámicas.
*   **Backend (El cerebro):** La API REST está hecha en Node.js usando **NestJS** (TypeScript). Aquí es donde el servidor recibe el token de Google, auto-registra al usuario, y procesa la matemática de los reportes de ventas sin saturar el celular del usuario."

---

## 🗄️ Estructura de la Base de Datos y BigQuery (Orador 4 - DBA)

**[Cambio de diapositiva: Base de Datos]**
"Y todo esto está respaldado por nuestra infraestructura de datos. Usamos **PostgreSQL 16**. Nuestra base es totalmente relacional y manejamos tablas críticas como:
*   `users`: Control de accesos y el identificador que nos manda Google.
*   `products` e `inventory_records`: Donde amarramos el catálogo con el stock físico.
*   `orders`, `order_items` y `daily_sales`: Todo el registro maestro-detalle que genera los gráficos del Dashboard.

**El plus para esta Evaluación (Unidad 2):**
Configuramos la base de datos para habilitar la extensión `pg_stat_statements`. Creamos una vista SQL llamada `v_daily_export` que mapea el consumo exacto de los recursos de consultas del sistema. Luego, desde NestJS, enviamos automáticamente copias instantáneas (*Snapshots*) directo a la nube de **Google BigQuery** asociadas al proyecto de la universidad (`data-from-software`). Es decir, el sistema no solo funciona, sino que es auditable en la nube en tiempo real."

---

## 👥 Cierre y Equipo (Todos / Líder)

**[Cambio de diapositiva: Equipo y Despedida]**
"Crear TienditaCampus nos exigió aplicar de forma cruzada materias de Bases de Datos, Desarrollo Web, Estadística e Ingeniería de Software.

*   **[Tu Nombre]** - *[Tu Rol, ej. Líder de Proyecto / Frontend]*
*   **[Compañero 1]** - *[Rol, ej. Backend / Integración Google]*
*   **[Compañero 2]** - *[Rol, ej. Administrador de DB]*
*   *(Agrega más si son más)*

En conclusión, TienditaCampus demuestra que la tecnología de alto nivel no es exclusiva de las grandes cadenas. Con código limpio y bases de datos robustas, podemos formalizar la economía de nuestros campus. ¡Muchas gracias por su atención! Abrimos espacio para sus preguntas sobre la arquitectura o implementación."
