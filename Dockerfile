FROM node:22.13.1-alpine AS first

LABEL maintainer="te-hung.tseng@ess.eu"
ARG VITE_APP_BASE_URL=/Olog
ENV VITE_APP_BASE_URL=${VITE_APP_BASE_URL}
ENV VITE_APP_LEVEL_VALUES='["Normal","Shift Start","Shift End","Fault","Beam Loss","Beam Configuration","Crew","Expert Intervention Call","Incident"]'
ENV VITE_APP_DEFAULT_LEVEL="Normal"
ENV TAG_VERSION="v2.4.0"
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN git clone -b ${TAG_VERSION} --single-branch https://github.com/Olog/olog-es-web-client.git /usr/src/phoebus-olog-web-client
WORKDIR /usr/src/phoebus-olog-web-client
RUN npm ci
RUN npm run-script build

FROM node:22.13.1-alpine

COPY --from=first /usr/src/phoebus-olog-web-client/build/ /usr/src/phoebus-olog-web-client/build/
WORKDIR /usr/src/phoebus-olog-web-client/
EXPOSE 5000
RUN npm install -g serve
RUN addgroup -S nodejs && adduser -s /bin/bash -S nodejs -G nodejs
USER nodejs
CMD ["serve", "-p", "5000", "-s", "build"]
