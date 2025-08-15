# Verifies that image can be built successfully
# For e.g. a production environment
FROM node:22-alpine AS first
ARG VITE_APP_BASE_URL=/Olog
ENV NODE_ENV=production
ENV VITE_APP_BASE_URL=${VITE_APP_BASE_URL}
RUN apk update && apk upgrade
COPY . /usr/src/olog-web
WORKDIR /usr/src/olog-web
RUN npm ci
RUN npm run build
# Dummy command
CMD ["echo", "success!"]
