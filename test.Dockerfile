# Verifies that image can be built successfully
# For e.g. a production environment
FROM node:18-alpine as first
ARG VITE_APP_BACKEND_URL=/Olog
ENV NODE_ENV=production
ENV VITE_APP_BACKEND_URL=${VITE_APP_BACKEND_URL}
RUN apk update && apk upgrade
COPY . /usr/src/olog-web
WORKDIR /usr/src/olog-web
RUN npm ci
RUN npm run build
# Dummy command
CMD ["echo", "success!"]
