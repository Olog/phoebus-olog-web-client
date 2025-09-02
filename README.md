# Olog Web Client

This project implements a web client for the Phoebus Olog logbook service. It provides read, write and search capabilities, but not the full feature set of the CS Studio (Java) logbook client, see https://github.com/ControlSystemStudio/phoebus

Technology stack:

- ReactJS (main framework)
- Redux Toolkit (app state, http clients)
- Remarkable for commonmark processing/rendering (https://github.com/jonschlinkert/remarkable)
- Jest for unit testing
- Cypress and docker-compose for end-to-end testing
- Storybook for previewing components in isolation (without a backend)

## Commonmark support

Markup as defined by the Commonmark specification is supported, see https://commonmark.org/.

Commonmark cheatsheet: https://commonmark.org/help/

### Commonmark extensions

The following extensions are supported:

- Image size, e.g. `![alt-text](http://foo.bar.com/image.jpg){width=640 height=480}`.
- Tables, see https://docs.github.com/en/free-pro-team@latest/github/writing-on-github/organizing-information-with-tables.

## Current state of affairs:

Available:

- Search and read log entries, no authentication required.
- Display log entry details, including image thumbnails, links to non-image attachments and properties.
- Login to Phoebus Olog backend.
- Create new log entry, including attachments. Input is validated.
- Search criteria: list of logbooks, list of tags, time span, title, description, level and author.
- Custom dialog for embedding images (from file system) into log entry body.
- Support for URLs to show single log entry, e.g. http://my.olog.server.com/logs/1234.
- Support for grouping log entries through a "reply" button.
- List view for search results.
- Properties editor.
- HTML preview of log entry, including embedded images.
- Editing log entries

Backlog:

- Localization.

## Customization and Environment Variables

### Configuration File

The file `src/config/customization.js` contains customizable items, such as level/entry-type values, default search, and more. Please review its contents and adjust to your needs.

### Environment Variables

Environment variables can be set directly on the terminal, or they can be loaded via the `.env` file automatically when npm runs. Copy the `.env.example` file and rename to `.env`.

Note that `VITE_APP_*` variables are only embedded during build time they cannot be read from the environment during runtime.

| Environment variable                                | Description                                                                                                                                                                                   |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| VITE_APP_BASE_URL                                   | The [Phoebus Olog Backend](https://github.com/Olog/phoebus-olog) base URL (for example: `http://localhost:8080/Olog`). Default is the same host as the frontend; e.g. `http://localhost:3000` |
| VITE_APP_WEBSOCKET_BASE_URL                         | The [Phoebus Olog Websocket](https://github.com/Olog/phoebus-olog) base URL (for example: `ws://localhost:8080/Olog/web-socket`)                                                              |
| VITE_APP_DOCS_HREF                                  | URL where more information can be found on Olog, shown on Help page;                                                                                                                          |
| default is `https://olog.readthedocs.io/en/latest/` |
| VITE_APP_SUPPORT_HREF                               | URL where support can be found for Olog. Shown on Help page only if provided.                                                                                                                 |
| VITE_APP_VERSION                                    | Version string for Olog; default is the version defined in `package.json`.                                                                                                                    |
| VITE_APP_VERSION_HREF                               | URL where this version of Olog can be found. Shown on Help page only if provided.                                                                                                             |

## Development

### Tooling

In order to develop and test with reasonable effort you will need the proper toolchain:

1. Node JS, install latest (>= 17.x) version.
1. Docker; backend services are defined via compose files. IMPORTANT: Allocate at least 4 CPU cores and 8GB RAM, consider increasing if tests fail.
1. A reasonably clever text editor. Visual Studio Code is a good alternative as it comes with some support for React development.
1. Optional: a React JS add-on to your browser.

### Running / Building

Start the backend services via the docker:

```
docker compose up
```

Install and start the frontend:

```
npm ci
npm start
```

The application will be available on `http://localhost:3000`.

### Previewing Components (Storybook)

If you want to view components in isolation (without running the backend or starting the app above),
you can preview them via [Storybook](https://storybook.js.org/):

```
npm run storybook
```

Components can then be previewed at `http://localhost:6006/`

### Unit and Component Tests

This test script runs both React Testing Library (RTL) unit tests and [Cypress](https://www.cypress.io/) component tests:

```
./scripts/test.sh
```

> **Note:**
>
> You may see warnings or errors in the console related to being unable
> to reach the logbook service; these are part of negative tests that exercise
> the frontend when the service is unavailable, and can be ignored if passing.

### End-To-End Tests

End-to-end testing is run via [Cypress](https://www.cypress.io/), and is provided via a separate project in the `e2e/` folder that does not depend on the frontend code.

You can run tests interactively (this will open cypress, a browser, etc. and execute the tests live) or you can run them headlessly one-time via docker compose (videos of the tests are made available in the `cypress/videos` and `cypress/screenshots` folders, and is ignored by git)

Run end-to-end tests interactively (opens Cypress's test runner in a new window):

```
# (start the backend services in one console)
# (start the frontend in another console)
# In a new console:
cd e2e
npm ci
npm test
```

Run end-to-end tests headlessly (from the main project directory):

```
./scripts/e2e-test.sh
```

## Deployment

There are no special deployment considerations.

Please note the Dockerfile example here is simple and doesn't include all necessary build variables.

Otherwise, refer to the above section on customization and environment varialbes as required for your particular deployment environment / configuration management system.
