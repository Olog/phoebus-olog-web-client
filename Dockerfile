# Node 22
FROM node:22-alpine
RUN apk update && apk add curl bash
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . ./
RUN npm ci 
# --silent

# start app
CMD ["npm", "start"]
