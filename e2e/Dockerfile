FROM cypress/included:12.5.1
WORKDIR /app
COPY . ./
RUN npm ci --silent
ENTRYPOINT [ "cypress", "run" ]