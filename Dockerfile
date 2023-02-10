# Node 18
FROM node:18-alpine
RUN apk update && apk add curl bash
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . ./
RUN npm ci --silent

# start app
CMD ["npm", "start"]