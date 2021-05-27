# Olog es web client

Note: this is work in progress. 

This project implements a web client for the olog es logbook service. The objective is to provide read, write and search capabilities, though not the full feature set of the CS Studio logbook client, see https://github.com/ControlSystemStudio/phoebus

Technology stack:
* ReactJS (main framework)
* React Bootstrap (UI components)
* axios (back-end access)
* Remarkable for commonmark processing/rendering (https://github.com/jonschlinkert/remarkable)

## Commonmark support
The client supports markup as defined by the Commonmark specification, see https://commonmark.org/. When creating a log entry the user may optionally use this markup scheme in the description field, which will be processed and converted to HTML elements when the log entry is rendered. 

Commonmark cheatsheet: https://commonmark.org/help/

### Commonmark extensions
The following extensions are supported:
- Image size, e.g. `![alt-text](http://foo.bar.com/image.jpg){width=640 height=480}`.
- Tables, see https://docs.github.com/en/free-pro-team@latest/github/writing-on-github/organizing-information-with-tables.

## Current state of affairs:

Available:
* Search and read log entries, no authentication required.
* Display log entry details, including image thumbnails, links to non-image attachments and properties.
* Login to Olog-ES backend.
* Create new log entry, including attachments. Input is validated.
* Search criteria: list of logbooks, list of tags, time span, title, description, level and author.
* Custom dialog for embedding images (from file system) into log entry body.
* Support for URLs to show single log entry, e.g. http://my.olog.server.com/logs/1234.

Backlog:
* Properties editor.
* Localization.
* Site customization.

## Toolchain

In order to develop and test with reasonable effort you will need the proper toolchain:

1) Node JS, install the latest version.
2) A text editor capable of syntax highlighting. Visual Studio Code is a good alternative as it comes with good support for React development. There are a numerous extensions for VS Code that may enhance the development experience even further.
3) Optional: a React JS add-on to your browser, which should probably be Chrome or Firefox.

## Development

Install the toolchain and then:

1) Clone this project and cd to it.
2) Invoke ``>npm install`` to download dependencies. The process may complain about various issues (e.g. missing git support on Mac, deprecated versions).
3) Create a ``.env`` file in the root directory. Add the line:
   ``REACT_APP_BASE_URL='url-to-Olog-ES-service'``.
4) Launch the Olog-ES backend. Or mock it.
5) Invoke ``>npm start`` to launch the Node JS development server.
6) Develop.

### Unit testing

Unit test code can be added in file named like ``*.test.js``.
   
To run tests, invoke ``>npm run test``.

## Deployment

The below instructions apply to a deployment scenario where a web server hosts the (static) web client resources, and at the same time acts as a reverse proxy resolving calls to the Olog-ES backend. 

1) Review the file `customization.js`. It contains a few values defining text resources that might differ between sites. If you need different values, update according to your needs, but please do not commit the changes.

2) Build the deployment artifacts:\
   `>REACT_APP_BASE_URL=Olog/ npm run-script build`\
   Note that the `REACT_APP_BASE_URL=Olog/` portion of the command is needed in order to override whatever value in the `.env` file. The actual value will depend on 
   how the web application is deployed.
   
   This will generate files in the `build` directory, all of which must be copied to the target web server. Publish the web client resource under the root context, i.e. the URL `http://<host>/` shall resolve to the file `index.html` found in the build output.
   
3) On the target web server, configure the reverse proxy to map the path /Olog to the Olog-ES backend. On Apache this is done like so (the rewrite rules may not be needed on other type of front end servers):

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
   
  
   In this example the Olog-ES backend is deployed on the same host on port 8080.
   





