# Endpoint Lareira · despliegue

La web sigue en GitHub Pages. Solo el backend se aloja en el VPS de proyectos. No se usan las bases de datos ni las credenciales de LocalSnow/OBA.

## Cerrado no significa lanzado

Por defecto `LAREIRA_SUBMISSIONS_ENABLED=false` y `LAREIRA_PUBLIC_ENABLED=false`: no exige SMTP, no publica puertos ni router y POST /api/brief responde 503. GET /healthz identifica la revisión y `acceptingSubmissions:false`. Este estado sirve para verificar infraestructura, no recoge solicitudes.

## Construir y preparar

Desarrollar/probar en el Mac. Verificar el contexto Docker antes de construir: `desktop-linux` es local en este Mac, `localsnow` apunta a producción. Si Desktop está pausado por el propietario, no cambiar esa preferencia; el VPS puede construir/probar el artefacto en un contenedor aislado, como operación de despliegue autorizada.

```sh
node --test brief/tests/*.test.mjs
(cd backend && npm ci --ignore-scripts && npm test)
docker --context desktop-linux build --build-arg RELEASE_SHA="$(git rev-parse HEAD)" -t "lareira-brief:$(git rev-parse HEAD)" backend
```

La imagen usa Node 24 Alpine por digest, dependencia por lockfile, contexto permitido sin .env, usuario no-root, raíz de solo lectura, capacidades eliminadas y tmpfs. Swarm limita a 128 MiB / 0,30 CPU.

Sobre el manager del VPS autorizado, con la imagen y revisión revisadas:

```sh
export LAREIRA_IMAGE=lareira-brief:SHA_COMPLETO_REVISADO
export LAREIRA_SUBMISSIONS_ENABLED=false
export LAREIRA_PUBLIC_ENABLED=false
docker stack config -c deploy/lareira-brief.yml >/dev/null
docker stack deploy --resolve-image never -c deploy/lareira-brief.yml lareira
```

Sin --prune ni cambios en otros stacks. La imagen local es una receta para Swarm de nodo único: verificar etiqueta OCI, ID y revisión real del contenedor. Si se añaden nodos, publicar primero en registro autorizado y fijar digest. Una réplica: la deduplicación actual es en memoria y se pierde con reinicios; no promete exactamente un envío.

## Activación

1. Confirmar proveedor/remitente y responsable/conservación/proveedores del aviso de privacidad. No activar recogida con el aviso borrador.
2. Crear secretos Swarm versionados exclusivos de Lareira por canal seguro. Sus nombres, no valores, van en `LAREIRA_SMTP_USER_SECRET` y `LAREIRA_SMTP_PASSWORD_SECRET`. El overlay `deploy/lareira-mail.yml` los monta en /run/secrets. No imprimir secretos, pasarlos por argumentos, alterarlos ni reutilizar los de otros proyectos.
3. Configurar `LAREIRA_SMTP_HOST`, puerto 465/587, `LAREIRA_CONTACT_FROM` y añadir `-c deploy/lareira-mail.yml` al parser/despliegue. Si se habilita sin configuración válida, falla cerrado.
4. Crear/verificar DNS de api.lareirasoftware.com sin mover Pages ni tocar los MX existentes. Activar router con `LAREIRA_PUBLIC_ENABLED=true` manteniendo solicitudes desactivadas; verificar HTTPS real, revisión y estado. El limitador usa IP de conexión a Traefik: revisar origen real antes de añadir CDN.
5. Activar `LAREIRA_SUBMISSIONS_ENABLED=true` solo con configuración completa. Fijar la meta brief-endpoint a la URL HTTPS real, revisar protección antibot y comprobar recepción de una prueba sintética autorizada en el buzón. Aceptación SMTP no prueba llegada a bandeja.
6. Solo entonces publicar/enlazar brief/ mediante Pages y retirar la nota de borrador. No publicar backend, secretos ni node_modules en Pages.

## Verificar y cerrar

Leer servicios/tareas del stack lareira, health del contenedor exacto, revisión, imagen/ID, puertos y referencias de secretos (nunca sus valores). /healthz no prueba autenticación SMTP ni recepción.

Para cerrar sin borrar datos: redeplegar la misma imagen con ambos flags false. Para rollback: imagen anterior verificada y sus referencias de secretos. No borrar secretos ni reiniciar servicios ajenos.
