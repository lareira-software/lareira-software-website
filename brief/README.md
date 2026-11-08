# Cuestionario de brief del boceto · prototipo (no publicado)

Cuestionario corto de cinco pasos para negocios que piden un boceto: negocio, necesidad, material e idiomas, encaje y fecha, contacto y resumen. Genera un resumen editable que la persona puede copiar, descargar o preparar como mensaje de WhatsApp. No envía nada por sí solo y no dice nunca que Lareira lo haya recibido.

**Estado:** prototipo para revisar. No está enlazado desde la web ni entra en la publicación: el proceso de publicación solo copia `index.html`, `CNAME`, `img` y `fonts`. La página lleva `noindex`. No hacer merge de este PR hasta que esté listo.

Abre `brief/index.html` directamente o sirve la carpeta con `python3 -m http.server 4192 --bind 127.0.0.1`. Son archivos estáticos sin npm.

Las respuestas se guardan solo en `sessionStorage` de la pestaña. Sin servidor, cookies, analítica, subidas ni peticiones externas. «Borrar respuestas» limpia ese almacenamiento. No introducir datos reales en las pruebas.

Antes de publicarlo: revisar las preguntas, decidir cómo se reciben las respuestas (WhatsApp o un servicio que las guarde), revisar la información de privacidad, probar el envío con autorización y reconciliar el precio y los plazos con los de la web. Para que salga en la web habría que añadir `brief` al paso de copia del proceso de publicación y enlazarlo.

Prueba del modelo: `node --test brief/tests/model.test.mjs`
