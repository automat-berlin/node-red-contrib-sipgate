# Node-RED sipgate.io

This repository contains a collection of nodes which implements [sipgate.io API](https://developer.sipgate.io).

## Installation

First clone this repository. Optionally switch to the desired branch.

Next, go to the Node-RED directory, typically `~/.node-red` and install there the cloned package.
```
cd ~/.node-red/
npm install <path-to-cloned-repository>
```

## Configuration

You should be aware how to configure Node-RED ([read the docs here](https://nodered.org/docs/configuration)).

Following instructions assume that you are using settings.js file for configuration.

### Set baseUrl for callbacks

The base URL will be used to create absolute URLs for callbacks (onData, onAnswer, onHangup) required by sipgate.io Push API.

Find `functionGlobalContext` object and add `baseUrl` property with the base URL of your Node-RED deployment.
```
    ...
    functionGlobalContext: {
        baseUrl: 'http://example.com'
    },
    ...
```

## Tests

First go to the repository and install all dependencies:
```
npm install
```

Then to run all tests use this command:
```
npm test
```
