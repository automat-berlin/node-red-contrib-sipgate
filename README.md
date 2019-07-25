# Node-RED sipgate.io

This repository contains a collection of nodes which implements [sipgate.io API](https://developer.sipgate.io).

*This is a community project. sipgate is a registered trademark of sipgate GmbH in Germany and other countries. Automat Berlin GmbH as well as the initial authors of this module are not affiliated with, nor endorsed by, nor connected in any way to sipgate GmbH or any of their subsidiaries.*

## Installation

First clone this repository. Optionally switch to the desired branch.

Next, go to the Node-RED install directory, typically `~/.node-red` and install there the cloned package.
```
cd ~/.node-red/
npm install <path-to-cloned-repository>
```

## Configuration

You should be aware how to configure Node-RED ([read the docs here](https://nodered.org/docs/configuration)).

Following instructions assume that you are using `settings.js` file for configuration (found in the user directory or specified with `-s` command line argument).

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

## Contribute

We welcome any contributions. Contact us if you have any questions.

## Contact

This repository is owned and maintained by [Automat Berlin GmbH](https://automat.berlin/).

sipgate is a trademark of sipgate GmbH in Germany and in other countries.

## License

The code in this repository is released under the MIT license. See [LICENSE](LICENSE) for details.