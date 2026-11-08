#!/usr/bin/env bash
# Crea los secretos SMTP de Lareira en Docker Swarm sin mostrar ni guardar valores en el historial.
# Uso: bash create-smtp-secrets.sh   (en el VPS, con un usuario que pueda ejecutar docker)
set -euo pipefail
version="${1:-v1}"
user_secret="lareira_smtp_user_${version}"
pass_secret="lareira_smtp_password_${version}"
for name in "$user_secret" "$pass_secret"; do
  if docker secret inspect "$name" >/dev/null 2>&1; then
    echo "Ya existe $name. Usa otra versión: bash $0 v2" >&2
    exit 1
  fi
done
smtp_user="${LAREIRA_SMTP_USER:-}"
if [ -z "$smtp_user" ]; then
  printf 'Usuario SMTP (p. ej. info@lareirasoftware.com): '
  IFS= read -r smtp_user
else
  echo "Usuario SMTP: $smtp_user"
fi
printf 'Contraseña de aplicación de Zoho (no se verá al escribir): '
IFS= read -rs smtp_pass
printf '\n'
if [ -z "$smtp_user" ] || [ -z "$smtp_pass" ]; then
  echo "Usuario o contraseña vacíos: no se ha creado nada." >&2
  exit 1
fi
printf '%s' "$smtp_user" | docker secret create --label app=lareira-brief "$user_secret" - >/dev/null
printf '%s' "$smtp_pass" | docker secret create --label app=lareira-brief "$pass_secret" - >/dev/null
unset smtp_user smtp_pass
echo "Creados: $user_secret y $pass_secret (los valores no se muestran)."
