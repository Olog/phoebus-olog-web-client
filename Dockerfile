ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION} AS builder

LABEL maintainer="te-hung.tseng@ess.eu"
WORKDIR /usr/src/phoebus-olog-web-client
COPY . .
RUN npm ci
RUN npm run build --force

FROM nginx:1.23.1-alpine

RUN rm -rf /etc/nginx/conf.d
RUN mkdir /etc/nginx/conf.d
COPY docker/default.conf /etc/nginx/conf.d
COPY --from=builder /usr/src/phoebus-olog-web-client/build /usr/share/nginx/html/

COPY env.sh /docker-entrypoint.d/env.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]
