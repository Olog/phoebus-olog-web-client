FROM cypress/included:12.5.1
WORKDIR /e2e
COPY . ./
RUN npm ci --silent
ENTRYPOINT [ "cypress", "run" ]
