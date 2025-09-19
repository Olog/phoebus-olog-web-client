FROM node:22.13.1 AS builder

LABEL maintainer="te-hung.tseng@ess.eu"
WORKDIR /usr/src/phoebus-olog-web-client
COPY . .
RUN npm ci
RUN npm run build --force

FROM nginx:1.23.1-alpine

COPY docker/default.conf /etc/nginx/conf.d
COPY --from=builder /usr/src/phoebus-olog-web-client/build /usr/share/nginx/html/

COPY --chmod=755 env.sh /docker-entrypoint.d/env.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]
