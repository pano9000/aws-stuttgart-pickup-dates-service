FROM node:20-slim AS nuxt_build

RUN mkdir -p /var/www/app-build && \
    chown -R node:node /var/www/app-build

WORKDIR /var/www/app-build

COPY --chown=node:node ./package*.json ./

RUN npm ci

COPY --chown=node:node ./*.json ./
COPY --chown=node:node ./*.ts ./
COPY --chown=node:node ./*.vue ./
COPY --chown=node:node ./public ./public
COPY --chown=node:node ./server ./server
COPY --chown=node:node ./pages ./pages
COPY --chown=node:node ./components ./components
COPY --chown=node:node ./composables ./composables
COPY --chown=node:node ./i18n ./i18n
COPY --chown=node:node ./assets ./assets
COPY --chown=node:node ./utils ./utils
COPY --chown=node:node ./plugins ./plugins




RUN npm run build
RUN npm prune --omit=dev && npm cache clean --force

FROM nuxt_build AS nuxt_run

RUN mkdir -p /var/www/app && \
    chown -R node:node /var/www/app

COPY --from=nuxt_build --chown=node:node /var/www/app-build/.output /var/www/app

CMD [ "node", ".output/server/index.mjs" ]