FROM cypress/included:14.5.4
WORKDIR /e2e
COPY . ./
RUN npm ci --silent
ENTRYPOINT [ "cypress", "run" ]
