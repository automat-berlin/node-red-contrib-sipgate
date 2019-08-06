module.exports = {
  // the tcp port that the Node-RED web server is listening on
  uiPort: process.env.PORT || 1880,

  // Node-RED scans the `nodes` directory in the userDir to find local node files
  userDir: __dirname,

  // defines order of the categories in the editor palette
  paletteCategories: [
    'subflows',
    'sipgate_Push_API',
    'sipgate_RTCM_API',
    'input',
    'output',
    'function',
    'storage',
    'advanced',
  ],
};
