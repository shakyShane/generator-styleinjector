/**
 *
 * @type {{port: number, reloadFileTypes: Array, injectFileTypes: Array}}
 */
var options = {
  paths: [
    '<%= assetPath %>/css/**/*.css',
    '<%= assetPath %>/img/**/*.png',
    '<%= assetPath %>/fonts/**',
    '<%= assetPath %>/js/**/*.js',
    '**/*.php'
  ],
  urlTransforms: {
    prefix : "/",
    suffix : null,
    remove : null
  },
  socketIoPort: <%= port %>,
  reloadFileTypes: ['.php', '.html', '.js'],
  injectFileTypes: ['.css', '.png', '.jpg']
};

/**
 * Dependencies
 * @type {exports.listen|*}
 */
var io = require('socket.io').listen(options.socketIoPort);
var chokidar = require('chokidar');
var glob = require("glob");
var _ = require("lodash");

var filePaths = [];
var completed = 0;

// Wait for async tasks to complete
var waiter = setInterval(function () {
  if (completed === options.paths.length) {
    watchFiles(filePaths);
    clearInterval(waiter);
  }
}, 100);

// Add all the files listed
options.paths.forEach(function (path) {
  glob(path, null, function (er, files) {
    filePaths = _.union(filePaths, files);
    completed += 1;
  });
});

// Watch for changes and talk to Socket.io when needed.
var watchFiles = function (files) {
  var watcher = chokidar.watch(files, {ignored: /^\./, persistent: true});
  watcher.on('change', changeFile);
};

/**
 * Emit the event to the client to reload/inject
 * @param {string} path
 */
var changeFile = function (path) {

  // get the file extention
  var fileExtension = /\.[a-zA-Z]{2,4}$/.exec(path)[0];
  var data = {};

  // reload the entire page if the changed file's extension is in the options array
  if (_.contains(options.reloadFileTypes, fileExtension)) {
    io.sockets.emit("reload", { url: path });
  } else {

    // try to inject the files.
    data.assetUrl = transformUrl(path);
    data.fileExtention = fileExtension;
    io.sockets.emit("reload", data);

  }
};

// Make sure the client receives the url path (not the relative paths used here)
  var transformUrl = function (path) {
    if (!options.urlTransforms.remove) {
    return [options.urlTransforms.prefix, path, options.urlTransforms.suffix].join("");
    } else {
    return path.replace(options.urlTransforms.remove, "");
    }
  };