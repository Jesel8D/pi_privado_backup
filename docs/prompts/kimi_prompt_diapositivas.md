# Súper-Prompt para Kimi: Generación de Diapositivas (Modelo "Cero-Fricción IA")
*(Copia y pega todo el texto debajo de esta línea en tu chat con Kimi)*

---

**[ROL Y CONTEXTO DEL SISTEMA]**
Actúa como un Diseñador de Presentaciones Ejecutivo Nivel Senior y Consultor Práctico de Ingeniería de Software. Tu objetivo es convertir un extenso guion de exposición universitaria (que te proporcionaré más abajo) en un bosquejo exacto para diapositivas (PowerPoint / Keynote). Tu tarea no es solo resumir, sino *arquitectar* cómo se debe ver y leer cada diapositiva en la pantalla mientras un universitario expone el tema.

El proyecto se llama "TienditaCampus", un sistema de gestión de inventarios, punto de venta y análisis estadístico creado por estudiantes para estudiantes (microeconomías universitarias). Utiliza Next.js, NestJS, Docker, PostgreSQL y Google BigQuery, aplicando el método matemático del Rango Intercuartílico (IQR) para reducir las mermas de comida perecedera.

**[RESTRICCIONES CRÍTICAS DE TONO Y ESTILO (LEER CON ATENCIÓN)]**
Es de vital importancia, y tu métrica número uno de éxito, que el resultado NO parezca generado por una Inteligencia Artificial. Los profesores universitarios rechazan instantáneamente cualquier presentación que use jerga típica de ChatGPT o Claude. 
Por lo tanto, TIENES ESTRICTAMENTE PROHIBIDO usar las siguientes palabras o frases (o sus sinónimos directos) en CUALQUIER PARTE de tu respuesta:
* "Adentrémonos", "Sumerjámonos", "Exploremos"
* "Tejido empresarial", "Panorama actual"
* "Revolucionario", "Innovador", "Vanguardia"
* "En resumen", "En conclusión", "Para concluir"
* "Sinergia", "Holístico", "Disruptivo"
* "Un mundo cada vez más digital", "En la era de la información"
* "Desentrañar", "Navegar"
* "Impulsar el éxito", "Desbloquear el potencial"

Tu tono debe ser asertivo, técnico, directo, realista, conciso y de negocios/ingeniería. Hablas como un ingeniero de software presentando el cierre de su proyecto final. Punto y aparte. Usa viñetas cortas. Si una frase puede decirse en 5 palabras, no uses 10.

**[REGLAS DE FORMATO DE SALIDA PARA CADA DIAPOSITIVA]**
Para cada diapositiva que diseñes, DEBES seguir exactamente la siguiente estructura de Markdown:

**Diapositiva #[Número]: [Título corto y contundente para la pantalla]**
*   **Contenidos Visuales Sugeridos:** [1-2 oraciones describiendo qué imagen, gráfica, diagrama o icono debería poner el estudiante de fondo. Ej. "Captura de pantalla del dashboard oscuro con el botón de Google SSO", "Diagrama ER mostrando la tabla orders apuntando a users", etc.]
*   **Texto en Pantalla (MÁXIMO 15 palabras en total repartidas en viñetas):** [Las diapositivas NO se leen, son apoyo visual. Pon aquí los 2 o 3 "bullet points" ultra-cortos que irán literalmente escritos en el PowerPoint].
*   **Notas del Orador (Pitch verbal, 3-4 líneas):** [Lo que el estudiante debe DECIR mientras está esta diapositiva. Base esto estrictamente en el "Texto Fuente" que te doy abajo, adaptado para ser hablado fluidamente].

**[ESTRUCTURA DE LA PRESENTACIÓN REQUERIDA]**
Debes distribuir el discurso en un total de **8 a 10 Diapositivas máximo**. La estructura debe seguir el flujo clásico de un Pitch Deck técnico:
1. Título (El nombre del proyecto y los autores).
2. El Problema (Desperdicio de alimento universitario y mermas).
3. La Competencia (Por qué FáciLUNCH, Too Good To Go o Toast POS no sirven para este nicho).
4. La Solución (TienditaCampus y la matemática: El método IQR).
5. Cumplimiento Normativo (NOM-251 y LFPDPPP / Google SSO).
6. Arquitectura General (El Stack: Next.js + NestJS + Docker).
7. Base de Datos Extendida (PostgreSQL y la integración con BigQuery / `pg_stat_statements`).
8. Cierre y Call to Action (Presentación del equipo y cierre).

**[TEXTO FUENTE Y GUION BASE]**
*(A continuación, te proporciono el guion textual que los estudiantes han preparado. Usa SOLO esta información para extraer los datos de tus diapositivas. No inventes funcionalidades que no se mencionen aquí. Transforma este bloque de texto en el formato de diapositivas solicitado).*

<TEXTO_FUENTE>
"Buenos días a todos. Quienes hemos vendido algo aquí en la universidad, o hemos comprado comida entre clases, sabemos que la logística es un caos. Muchos estudiantes emprenden para ayudarse con sus gastos diarios vendiendo sándwiches, postres o snacks. El problema es que se enfrentan a mermas altísimas porque sus productos se echan a perder rápido (son perecederos) y llevan el control en una libreta o simplemente 'al tanteo'. Se estima que en México se desperdician 30 millones de toneladas de alimento al año. Y en nuestra pequeña escala universitaria, ese desperdicio significa dinero perdido para el estudiante. Por eso creamos TienditaCampus: Un software de gestión, inventario y punto de venta diseñado EXCLUSIVAMENTE para las microeconomías universitarias.

Cuando empezamos a investigar, nos preguntamos: ¿Por qué no usan simplemente las apps que ya existen? Investigamos el mercado en México y encontramos dos tipos de plataformas:
1. Sistemas POS Tradicionales (Square, Toast): Son carísimos. Cobran comisiones de hasta 3% por transacción y mensualidades fijas. Un estudiante que vende tortas no tiene el margen de ganancia para pagar eso.
2. Apps Universitarias y de Rescate (FáciLUNCH, Infood, Too Good To Go): Estas apps están de moda. Infood o FáciLUNCH ayudan a apartar comida en cafeterías establecidas. Too Good To Go ayuda a vender lo que sobró.
La Diferencia de TienditaCampus: Nosotros no somos una app de 'delivery' ni de sobras. Nosotros atacamos la raíz matemática del problema de inventario usando Estadística. Implementamos el Método del Rango Intercuartílico (IQR) en el código para detectar anomalías en la venta. Si un día hay un evento y se vende el triple, el algoritmo limpia ese 'ruido' para no sobre-sugerir compras al día siguiente, reduciendo la merma pre-caducidad en un margen proyectado del 10%. Es estadística avanzada empaquetada en un software gratis para el estudiante.

Desarrollar software que maneja comida y datos personales en México no es un juego, por lo que adaptamos nuestra plataforma a dos regulaciones clave:
1. Sanidad (NOM-251-SSA1-2009): Esta norma regula la higiene en el proceso de alimentos. Como el estudiante maneja perecederos, nuestro software fuerza la metodología FIFO (Primeras Entradas, Primeras Salidas) en la base de datos de inventario. Así garantizamos que lo que caduca antes, se vende antes, cumpliendo con los estándares de salud pública.
2. Privacidad de Datos (LFPDPPP): Manejamos nombres, correos y reportes financieros. Por cumplimiento legal y para facilitar el acceso, integramos Google SSO (Single Sign-On). En lugar de guardar y arriesgar contraseñas, Google hace la validación segura de identidad, y nosotros solo vinculamos el token a nuestra base de datos, respetando la privacidad del usuario al máximo.

Ahora, ¿cómo pasamos esto a la realidad? Construimos el sistema como un 'Monorepo' profesional, corriendo bajo Docker Compose para asegurar que el ambiente de despliegue sea inmutable.
Frontend (Lo visual): Usamos React.js y Next.js 14. Necesitábamos que la interfaz fuera rápida para celulares (SSR - Server Side Rendering). Le dimos un diseño Dark Luxury moderno con TailwindCSS con alertas dinámicas.
Backend (El cerebro): La API REST está hecha en Node.js usando NestJS (TypeScript). Aquí es donde el servidor recibe el token de Google, auto-registra al usuario, y procesa la matemática de los reportes de ventas sin saturar el celular del usuario.

Y todo esto está respaldado por nuestra infraestructura de datos. Usamos PostgreSQL 16. Nuestra base es totalmente relacional y manejamos tablas críticas como:
users: Control de accesos y el identificador que nos manda Google.
products e inventory_records: Donde amarramos el catálogo con el stock físico.
orders, order_items y daily_sales: Todo el registro maestro-detalle que genera los gráficos del Dashboard.
El plus para esta Evaluación (Unidad 2): Configuramos la base de datos para habilitar la extensión pg_stat_statements. Creamos una vista SQL llamada v_daily_export que mapea el consumo exacto de los recursos de consultas del sistema. Luego, desde NestJS, enviamos automáticamente copias instantáneas (Snapshots) directo a la nube de Google BigQuery asociadas al proyecto de la universidad (data-from-software). Es decir, el sistema no solo funciona, sino que es auditable en la nube en tiempo real.

Crear TienditaCampus nos exigió aplicar de forma cruzada materias de Bases de Datos, Desarrollo Web, Estadística e Ingeniería de Software. En conclusión, TienditaCampus demuestra que la tecnología de alto nivel no es exclusiva de las grandes cadenas. Con código limpio y bases de datos robustas, podemos formalizar la economía de nuestros campus. ¡Muchas gracias por su atención! Abrimos espacio para sus preguntas sobre la arquitectura o implementación."
</TEXTO_FUENTE>

**[INSTRUCCIÓN FINAL PARA LA GENERACIÓN]**
Antes de comenzar, revisa mentalmente la lista de palabras prohibidas y asegúrate de no incluirlas. Piensa en el contraste: no quieres sonar como un robot entusiasta del marketing, quieres sonar como un ingeniero analítico presentando resultados a su jurado universitario de tesis. Procede a generar las diapositivas.
