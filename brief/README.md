# Cuestionario del boceto · revisión, sin publicar

Cinco pasos: negocio, necesidad, material e idiomas, encaje y fecha, contacto y resumen. El canal de entrega es un mensaje de WhatsApp preparado: la persona lo revisa y decide enviarlo allí. Elegir el correo como contacto indica dónde prefiere recibir la respuesta, no envía un email.

## Cómo revisarlo Moli y Cris

1. Generar la copia portátil con `python3 scripts/portable_quiz.py` y abrir `.git/quiz-review/revision-portatil.html` en el navegador del Mac. No necesita servidor ni instalar paquetes. Esta copia incluye fuente, estilos y scripts, y bloquea la apertura de WhatsApp para evitar envíos durante la revisión.
2. Cada uno rellena el cuestionario sin ayuda y con datos inventados (`Prueba Lareira`, una localidad y `prueba@example.invalid`). Comprobar si se entiende la oferta antes de responder, si alguna pregunta sobra o confunde y si el resumen contiene lo necesario para preparar el boceto.
3. Volver y editar una respuesta; revisar que se conserva el resto. Probar una solicitud simple y otra con reservas/tienda: la segunda debe pedir presupuesto a medida, no rechazar al negocio.
4. Anotar el texto de la pregunta y el cambio propuesto. No introducir datos de clientes ni pulsar un envío real. Usar «Borrar respuestas» al terminar.

El archivo portátil permite revisar el flujo en escritorio. La emulación de móvil no sustituye una prueba física en Safari/Chrome de teléfono. Para revisarlo en un móvil hace falta un enlace de previsualización autorizado; los visores de adjuntos HTML no siempre ejecutan JavaScript.

## Alcance y privacidad

La web base es de una página, 490 € IVA incluido, hasta dos idiomas, SEO local inicial, revisión inicial de ficha de Google y primer año de dominio y alojamiento con una actualización pequeña. Renovación, si se sigue con Lareira, de 150 €/año con IVA y una actualización pequeña. Plazo de la base: 7–15 días laborables desde aprobación del boceto, primer pago y material imprescindible; fecha a confirmar antes de contratar. Funciones a medida tienen presupuesto y plazo propios.

Las respuestas se guardan en `sessionStorage` de la pestaña, con alternativa en memoria cuando no está disponible. No hay backend de recepción, analítica ni envío automático. Abrir WhatsApp comparte el borrador con ese servicio antes de que la persona decida enviarlo; Lareira solo lo recibe si lo envía. Las copias descargadas o copiadas tienen que borrarse aparte.

El aviso de privacidad es un borrador por capas. **Pendientes antes de recoger datos reales:** confirmar la identidad legal del responsable, los criterios de conservación de mensajes recibidos y los proveedores/destinatarios y posibles transferencias. No se presentan los campos pendientes como una política legal terminada. Referencia: guía oficial AEPD sobre información cuando los datos se obtienen del interesado (FAQ-0217).

## Verificación

```sh
python3 scripts/portable_quiz.py
node --test brief/tests/model.test.mjs
node brief/tests/browser-smoke.mjs
```

El navegador de pruebas usa Chrome instalado en el Mac y el WebSocket nativo de Node, sin instalar dependencias. Solo datos sintéticos. El informe y las capturas quedan en `.git/quiz-review/`, fuera del contenido publicado.

**Publicación separada:** PR en borrador; no está enlazado desde la portada y el workflow actual no copia `brief/`. No cambiar `main`, enlaces ni despliegue como parte de esta revisión. La oferta nueva de la portada va en el PR #3; las respuestas del cuestionario no contratan ni reservan fecha. Pendiente la lectura de Moli y Cris y la prueba física en móvil.
