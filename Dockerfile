ARG NODE_VERSION=22.13.1

FROM node:${NODE_VERSION}-alpine AS build

LABEL maintainer="te-hung.tseng@ess.eu"
ARG VITE_APP_BASE_URL=/Olog
ENV VITE_APP_BASE_URL=${VITE_APP_BASE_URL}
ENV VITE_APP_LEVEL_VALUES='["Normal","Shift Start","Shift End","Fault","Beam Loss","Beam Configuration","Crew","Expert Intervention Call","Incident"]'
ENV VITE_APP_DEFAULT_LEVEL="Normal"
WORKDIR /usr/src/phoebus-olog-web-client
COPY . .
RUN npm ci
RUN npm run build -- --force

FROM node:${NODE_VERSION}-alpine

COPY --from=build /usr/src/phoebus-olog-web-client/build/ /usr/src/phoebus-olog-web-client/build/
WORKDIR /usr/src/phoebus-olog-web-client/
EXPOSE 5000
RUN npm install -g serve
RUN addgroup -S nodejs && adduser -s /bin/bash -S nodejs -G nodejs
USER nodejs
CMD ["serve", "-p", "5000", "-s", "build"]
