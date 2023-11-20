# Olog Web Client

This project implements a web client for the Phoebus Olog logbook service. It provides read, write and search capabilities, but not the full feature set of the CS Studio logbook client, see https://github.com/ControlSystemStudio/phoebus

Technology stack:
* ReactJS (main framework)
* Axios & Redux Toolkit (app state, http clients)
* Remarkable for commonmark processing/rendering (https://github.com/jonschlinkert/remarkable)
* Jest for unit testing
* Cypress and docker-compose for end-to-end testing
* Storybook for previewing components in isolation (without a backend)

## Commonmark support
Markup as defined by the Commonmark specification is supported, see https://commonmark.org/.

Commonmark cheatsheet: https://commonmark.org/help/

### Commonmark extensions
The following extensions are supported:
- Image size, e.g. `![alt-text](http://foo.bar.com/image.jpg){width=640 height=480}`.
- Tables, see https://docs.github.com/en/free-pro-team@latest/github/writing-on-github/organizing-information-with-tables.

## Current state of affairs:

Available:
* Search and read log entries, no authentication required.
* Display log entry details, including image thumbnails, links to non-image attachments and properties.
* Login to Phoebus Olog backend.
* Create new log entry, including attachments. Input is validated.
* Search criteria: list of logbooks, list of tags, time span, title, description, level and author.
* Custom dialog for embedding images (from file system) into log entry body.
* Support for URLs to show single log entry, e.g. http://my.olog.server.com/logs/1234.
* Support for grouping log entries through a "reply" button. 
* List view for search results.
* Properties editor.
* HTML preview of log entry, including embedded images.
* Editing log entries

Backlog:
* Localization.

## Site customization

The file `src/config/customization.js` contains customizable items. Please review its contents and adjust to your needs.

## Development 

### Environment Setup

#### Environment Variables

Environment variables can be set directly on the terminal, or they can be loaded via the `.env` file automatically when npm runs. Copy the `.env.example` file and rename to `.env`.

#### Tooling

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

### Storybook

If you want to view components in isolation (without running the backend or starting the app above), 
you can preview them via [Storybook](https://storybook.js.org/):

```
npm run storybook
```

Components can then be previewed at `http://localhost:6006/`

### Unit Tests

Run tests interactively:
```
npm test
```
Or run them one-time:
```
./scripts/test.sh
```

> **Note:**
> 
> You may see warnings or errors in the console related to being unable
to reach the logbook service; these are part of negative tests that exercise
the frontend when the service is unavailable, and can be ignored if passing.

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

### Static Checks / Linting
This project uses pre-commit to check (and mostly automatically fix) many formatting and other static problems.

Install the pre-commit hook via:
```
pre-commit install
```

And run via:
```
git add <your files>
pre-commit run -a
```

Checks also run during CI/CD. You can read more about pre-commit at [Pre-Commit's Docs](https://pre-commit.com/)

## Deployment

The below instructions apply to a deployment scenario where a web server hosts the (static) web client resources, and at the same time acts as a reverse proxy resolving calls to the Phoebus Olog backend (which need not run on the same host).

1. Review the file `customization.js`. It contains a few values defining text resources that might differ between sites. If you need different values, update according to your needs, but please do not commit the changes.

1. Build the deployment artifacts (`REACT_APP_*` variables must be set during build; they are compile-time variables):
   ```
   REACT_APP_BASE_URL=Olog/ npm run-script build
   ``` 
   Note that setting `REACT_APP_BASE_URL` is needed in order to override whatever value in the `.env` file. The actual value will depend on 
   how the web application is deployed.
   
   This will generate files in the `build` directory, all of which must be copied to the target web server. Publish the web client resource under the root context, i.e. the URL `http://<host>/` shall resolve to the file `index.html` found in the build output.
   
1. On the target web server, configure the reverse proxy to map the path /Olog to the Phoebus Olog backend. On Apache this is done like so (the rewrite rules may not be needed on other type of front end servers): 
   ```
   <VirtualHost *:80>
      ProxyPreserveHost On
      ServerName <my server name>
      ProxyPass /Olog/ http://localhost:8080/Olog/
      ProxyPassReverse /Olog/ http://localhost:8080/Olog/
      
      <Directory "/path/to/npm/build/output">
         RewriteEngine on
         RewriteCond %{HTTP_ACCEPT} text/html
         RewriteCond %{REQUEST_FILENAME} !-f
         RewriteRule ^ index.html [last]
         RewriteRule ^ - [last]
      </Directory>
   </VirtualHost>
   ```
   
   In this example the Phoebus Olog backend is deployed on the same host on port 8080.