# Recepción del cuestionario por correo

Endpoint Node que recibe `POST /api/brief` y entrega un correo de texto al buzón configurado. Sin base de datos, adjuntos, envíos al contacto del visitante ni apertura del programa de correo del cliente. El visitante solo pulsa «Enviar solicitud por correo» tras revisar el resumen.

## Desarrollo y pruebas

Node 24. En esta carpeta:

```sh
npm ci --ignore-scripts
npm test
```

Las pruebas usan datos sintéticos, HTTP local y un servidor SMTP de prueba en `127.0.0.1` con puerto efímero. No envían correos a Internet. La prueba SMTP usa la misma aplicación HTTP y Nodemailer, no una respuesta inventada. El SMTP local de pruebas no usa TLS; la configuración de producción exige TLS y verifica certificados, comprobado en otros tests.

## Configuración real (todavía no realizada)

Copiar `.env.example` a `.env` e introducir los valores por el canal seguro autorizado, nunca en Git ni por chat. `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` y `CONTACT_FROM` son obligatorios. `CONTACT_FROM` tiene que ser un remitente autorizado por el proveedor elegido. El destinatario por defecto es `lareirasoftwarecdm@gmail.com`; no lo elige el visitante. El remitente del visitante nunca sustituye el nuestro: solo se usa como Reply-To cuando ha pedido respuesta por email.

```sh
npm start
```

Arranca solo en loopback (`127.0.0.1:4180` por defecto). Fallará al arrancar si falta configuración. No crea cuentas ni configura DNS, SMTP o servicios de producción.

GitHub Pages **no ejecuta Node**. Para publicar: elegir un host/backend, configurar un proxy HTTPS hacia el puerto local o un endpoint HTTPS separado, fijar la meta `brief-endpoint` de `brief/index.html` a esa URL y configurar `ALLOWED_ORIGINS` con los orígenes exactos de la web. El valor `/api/brief` sirve para mismo origen/pruebas; no es una API existente en GitHub Pages. No publicar el `.env`, esta carpeta ni `node_modules` en Pages. Revisar permisos/dominio del remitente y hacer una prueba de recepción real autorizada. Todo despliegue, DNS y gasto siguen pendientes de aprobación.

## Controles y límites

- Solo POST JSON de hasta 16 KiB, orígenes exactos permitidos y validación del alcance/contacto en servidor. No se confían precios, rutas o destinatarios del navegador.
- Destinatario y remitente fijos del servidor. Texto plano y acceso a ficheros/URLs deshabilitado en Nodemailer. Sin registrar contenido del correo, credenciales ni tráfico SMTP.
- Campo trampa y diez solicitudes nuevas por minuto por dirección de conexión. El proxy no se confía automáticamente: NO se usa `X-Forwarded-For`. Si se despliega detrás de proxy, esta cuota se comparte entre visitantes de esa conexión; añadir rate-limit por IP verificada en el proxy antes de abrirlo al público. No es una defensa completa frente a bots; considerar protección adicional sin fricción según tráfico.
- Memoria acotada (hasta 1.000 entradas) para límite de intentos y deduplicación. Misma clave y respuestas comparten el envío en curso o resultado aceptado durante una hora; cambios con la misma clave dan conflicto. Fallos SMTP confirmados se pueden reintentar. No hay cola persistente: reinicios, expiración o varias instancias pueden producir duplicados. Un corte tras aceptación remota pero antes de confirmación también puede dejar un resultado incierto; no se promete exactamente una entrega.
- Éxito solo si SMTP acepta el destinatario. Esto **no prueba llegada a bandeja de entrada** ni evita rebotes posteriores. Los errores devuelven fallo, sin detalles internos; la interfaz conserva respuestas y no muestra éxito.
- La conservación del buzón/proveedor, la identidad legal y la revisión de privacidad están pendientes. No se recoge ningún cliente real con este borrador.

Referencias técnicas oficiales consultadas: https://nodemailer.com/smtp y https://nodemailer.com/message.
