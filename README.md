# Olog es web client

DISCLAIMER: this is work in progress!

This project provides a web client for the olog es logbook service. The objective is to provide read, write and search capabilities, though not the full feature set of the CS Studio logbook client, see https://github.com/ControlSystemStudio/phoebus

The olog es web client is based upon React JS and React Bootstrap.

## Toolchain

In order to develop and test with reasonable effort you will need the proper toolchain:

1) Node JS. Install the latest version.
2) A text editor capable of syntax highlighting. Visual Studio Code is a good alternative as it comes with good support for React development. There are a numerous extensions for VS Code that may enhance the development experience even further.
3) Optional: a React JS add-on to your browser, which should probably be Chrome or Firefox.

## Get started

Install the toolchain and then:

1) Clone this project and cd to it.
2) Invoke "npm install" to download dependencies. The process may complain about various issues (e.g. missing git support on Mac, deprecated versions), but should result in a large number of modules being installed in the node_modules directory.
3) Create a .env file in the root directory. Add the line:
   REACT_APP_BASE_URL='url-to-Olog-ES-service'
4) Invoke "npm start" to launch the Node JS development server.





