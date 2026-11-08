# Cuestionario del boceto · revisión, sin publicar

Cinco pasos, resumen editable y **una única acción de envío: correo desde la página**. No abre WhatsApp ni un cliente de correo. Se eliminan copia/descarga/JSON como salidas para el interesado. El contacto preferido indica dónde responderle, no cómo se entrega la solicitud a Lareira.

## Revisar en el Mac

```sh
python3 scripts/portable_quiz.py
```

Abrir `.git/quiz-review/revision-portatil.html` en Chrome. La copia portátil lleva `LAREIRA_REVIEW=true`: se puede rellenar y pulsar «Enviar solicitud por correo», pero se muestra «Modo revisión: envío desactivado» sin mandar datos ni simular éxito. No necesita servidor. Usar datos inventados y probar una petición sencilla y otra con reservas/tienda. Volver desde el final de una pregunta larga y comprobar que el siguiente/anterior empieza por su título. Abrir detalles largos de la izquierda y verificar que no se desplazan según la altura del formulario.

## Envío real

El frontend hace POST JSON a la URL de la meta `brief-endpoint` (relativa `/api/brief` para un host que sirva API y web). El backend está en `backend/`; validar primero su README y configurar correo/HTTPS. No hay API ejecutándose en GitHub Pages ni SMTP real configurado todavía. Ningún éxito se muestra sin respuesta explícita `ok:true, delivery:accepted, requestId`. Pendiente, fallo y reintento mantienen las respuestas; la referencia evita duplicados dentro de la ventana acotada del servidor.

El backend manda solo al buzón del negocio. No genera autorespuestas a direcciones suministradas por desconocidos. El servicio SMTP debe aceptar el destinatario antes de confirmar en pantalla; aceptación no garantiza entrega en bandeja.

## Pruebas

```sh
node --test brief/tests/*.test.mjs
python3 scripts/portable_quiz.py
node brief/tests/browser-smoke.mjs
node brief/tests/navigation-smoke.mjs
(cd backend && npm ci --ignore-scripts && npm test)
```

Browser-smoke usa Chrome/CDP instalado en el Mac. No instala otro navegador. Los servidores de prueba son de loopback y se cierran al acabar. Emular móvil no sustituye una prueba física en teléfono. Capturas/informes en `.git/quiz-review` y `.git/quiz-navigation`.

La oferta aprobada es Web base 490 € IVA incluido, ampliada 840 € y funciones a medida; la renovación de la base es 150 €/año si se mantiene con Lareira. El plazo de la base es 7–15 días laborables desde boceto aprobado, primer pago y material. La portada se actualiza por el PR #3.

**Pendiente de publicación:** lectura de Moli/Cris, identidad legal, conservación y revisión de proveedor de correo; configuración segura del SMTP y endpoint; prueba real de recepción autorizada; prueba de móvil físico; enlace y paso de copia de Pages. El aviso de privacidad sigue rotulado como borrador. El backend no guarda una base de datos: las respuestas se conservan en la pestaña y, si se envían, en el correo y sistemas del proveedor. Borrar la pestaña no borra un mensaje ya enviado.

No hacer merge, despliegue, DNS ni cambios de permisos como parte de esta revisión.
