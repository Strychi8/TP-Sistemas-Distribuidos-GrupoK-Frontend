# syntax=docker/dockerfile:1

# =============================================================================
# Stage 1 - BUILD
# Vite compila la app y "hornea" (inlines) las variables VITE_* DENTRO del
# bundle. Por eso los valores deben existir en BUILD TIME, no en runtime:
# un SPA estatico no ejecuta Node en produccion, asi que `import.meta.env`
# ya fue resuelto a strings literales durante `vite build`.
#
# Se reciben via ARG (build args) y se promueven a ENV para que:
#   1) `vite build` las vea en `process.env` (Vite prioriza process.env sobre .env)
#   2) puedan validarse y grep-earse en la etapa de verificacion
# =============================================================================
FROM node:22-alpine AS build

WORKDIR /app

# --- Dependencias PRIMERO (capa estable) ----------------------------------
# Se instalan ANTES de tocar los build args a proposito. Los args cambian
# por entorno (dev/staging/prod), y en Docker un cambio de ARG/ENV invalida
# TODAS las capas siguientes. Poniendolos despues, `npm ci` se reusa entre
# builds con distintas URLs. El cache mount de BuildKit ademas reusa la
# cache de descargas de npm incluso en un build en frio.
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# --- Codigo fuente --------------------------------------------------------
COPY . .

# --- Variables de entorno de build (obligatorias) -------------------------
# DESPUES de instalar deps: cambiar los --build-arg NO re-instala node_modules.
# Uso: docker build --build-arg VITE_API_BASE_URL=... --build-arg VITE_GRAPHQL_URL=... .
ARG VITE_API_BASE_URL
ARG VITE_GRAPHQL_URL

# ARG -> ENV: expone los args a `vite build` (Vite prioriza process.env sobre .env).
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL

# --- Guard 1: fail-fast si faltan los args (ANTES de compilar) ------------
# Evita "builds silenciosos" que quedan apuntando a los defaults de localhost.
RUN test -n "$VITE_API_BASE_URL" || { echo "ERROR: build-arg VITE_API_BASE_URL es obligatorio"; exit 1; } && \
    test -n "$VITE_GRAPHQL_URL"  || { echo "ERROR: build-arg VITE_GRAPHQL_URL es obligatorio";  exit 1; }

# --- Compilacion ----------------------------------------------------------
RUN npm run build

# --- Guard 2: verificar que las variables quedaron EMBEBIDAS en el bundle --
# Vite reemplaza `import.meta.env.VITE_*` por el valor literal, asi que el
# string debe aparecer textualmente en dist/. Si no aparece, el arg no llego.
RUN grep -Rq "$VITE_API_BASE_URL" dist || { echo "ERROR: VITE_API_BASE_URL no quedo embebida en dist/"; exit 1; } && \
    grep -Rq "$VITE_GRAPHQL_URL"  dist || { echo "ERROR: VITE_GRAPHQL_URL no quedo embebida en dist/";  exit 1; }

# =============================================================================
# Stage 2 - RUNTIME
# Solo se copia el artefacto estatico (dist/) sobre Nginx. Nada de Node,
# dependencias ni codigo fuente llegan a la imagen final (imagen mas chica
# y superficie de ataque reducida).
# =============================================================================
FROM nginx:1.27-alpine AS runtime

# Config de Nginx con fallback SPA (React Router).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Traer SOLO el build del stage anterior (multi-stage: el resto se descarta).
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Healthcheck simple: la imagen responde en el root.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
