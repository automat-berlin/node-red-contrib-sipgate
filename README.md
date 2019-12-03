# Node-RED sipgate.io

This repository contains a collection of nodes which implements [sipgate.io API](https://developer.sipgate.io).

_This is a community project. sipgate is a registered trademark of sipgate GmbH in Germany and other countries. Automat Berlin GmbH as well as the initial authors of this module are not affiliated with, nor endorsed by, nor connected in any way to sipgate GmbH or any of their subsidiaries._

## Quick start

You can get hands-on experience with Node-RED and sipgate nodes by deploying them to [Heroku](https://www.heroku.com). You only need a free account (no credit card required).

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Note: Deploy to Heroku button will not work properly if your browser is removing Referer HTTP header from the request.

## Installation

Prerequisite: You need to have a running Node-RED instance. If you don't have yet, read [Node-RED Getting Started guide](https://nodered.org/docs/getting-started/).

### Install last released version from Node-RED dashboard

The easiest way to install sipgate.io nodes is to use `Manage palette` option in Node-RED menu (in the top right corner of its dashboard). Switch to `Install` tab and search for `@automat-berlin/node-red-contrib-sipgate`. There should be only one result. Click the `install` button nearby it.

### Install from the source code

First clone this repository. Optionally switch to the desired branch.

Next, go to the Node-RED install directory, typically `~/.node-red` and install there the cloned package.

```
cd ~/.node-red/
npm install <path-to-cloned-repository>
```

## Configuration

You should be aware of how to configure Node-RED ([read the docs here](https://nodered.org/docs/user-guide/runtime/settings-file)).

Following instructions assume that you are using `settings.js` file for configuration (found in the user directory or specified with `-s` command-line argument).

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

First, go to the repository's main directory and install all dependencies:

```
npm install
```

Then to run all tests use this command:

```
npm test
```

## Contributing

We welcome all contributions. Please read our [contributing guidelines](CONTRIBUTING.md).

Contact us if you have any questions via email info@automat.berlin or create an issue.

## Contact

This repository is owned and maintained by [Automat Berlin GmbH](https://automat.berlin/).

sipgate is a trademark of sipgate GmbH in Germany and in other countries.

## License

The code in this repository is released under the MIT license. See [LICENSE](LICENSE) for details.
