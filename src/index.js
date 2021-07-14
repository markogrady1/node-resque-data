const Queue = require('./queue.js');
const fs = require('fs');
const express = require('express');

let queueInit;
let namespace;
let generateHTML = function(config, opts) {

  if (config && typeof config === 'object') {
    config.namespace = config.namespace || 'resque'
  }

  if (config.queues && typeof config.queues === Array) {

  }

  const html = fs.readFileSync(__dirname + '/queue-ui.html.tpl');
  try {
    fs.unlinkSync(__dirname + '/index.html');
  } catch (e) {

  }
  const htmlWithCustomCss = html.toString().replace('<% customCss %>', '');
  return htmlWithCustomCss.replace('<% title %>', 'Queue UI')
}


let setup = function(config, opts) {


  return function(req, res) {
    config.uiUrl = req.originalUrl
    const html = generateHTML(config, opts)
    const queue = new Queue(config);
    var js = fs.readFileSync(__dirname + '/queue-ui-init.js.tpl');
    const testOptions = {
      uiUrl: config.uiUrl,
    }
    queueInit = js.toString().replace('<% options %>', stringify(testOptions))
    queue.queue(config.queues, (data) => {
      queueInit = queueInit.toString().replace('<% dataObj %>', stringify(data, true))
      res.send(html)
    })
  };
}

const assetMiddleware = options => {
  const opts = options || {}
  opts.index = false

  return express.static(getAbsoluteFSPath(), opts)
}

const getAbsoluteFSPath = function() {
  // detect whether we are running in a browser or nodejs
  if (typeof module !== "undefined" && module.exports) {
    return require("path").resolve(__dirname)
  }
  throw new Error('getAbsoluteFSPath can only be called within a Nodejs environment');
}

const serve = [initFn, assetMiddleware()];

function initFn(req, res, next) {
  if (req.url === '/queue-ui-init.js') {
    res.set('Content-Type', 'application/javascript')
    res.send(queueInit)
  } else {
    next()
  }
}

const stringify = function(obj, isData) {
  const placeholder = '____CONTENTPLACEHOLDER____';
  let arr = [];
  let json = JSON.stringify(obj, function(key, value) {
    if (typeof value === 'function') {
      arr.push(value);
      return placeholder;
    }
    return value;
  }, 2);
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function(_) {
    return arr.shift();
  });
  if (isData) {
    return 'var dataObj = ' + json + ';';
  }
  return 'var options = ' + json + ';';
};

module.exports = {
  setup: setup,
  serve: serve,
}