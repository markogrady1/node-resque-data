const  Queue = require('./queue.js');
const  fs = require('fs');
const  express = require('express');

let queueInit;
let generateHTML =  function (config, opts) {

  if (config && typeof config === 'object') {
    namespace: config.namespace || 'resque'
  }

  const html = fs.readFileSync(__dirname + '/queue-ui.html.tpl');
    try {
      fs.unlinkSync(__dirname + '/index.html');
    } catch (e) {

    }
  const htmlWithCustomCss = html.toString().replace('<% customCss %>', '');

  var js = fs.readFileSync(__dirname + '/queue-ui-init.js.tpl');
  const testOptions = {
    test: 'foobar'
  }
  queueInit = js.toString().replace('<% options %>', stringify(testOptions))
  return htmlWithCustomCss.replace('<% title %>', 'Queue UI')
}


let setup = function (config, opts) {
  const html = generateHTML(config, opts)
    const queue = new Queue(config);

  return function (req, res) {
     queue.queue(['math', 'Chicago', 'bar','hubIndexQueue'], (data) => {
       console.log(data)
       const newHtml = html.toString().replace('<% numbers %>', data[0].num);
       res.send(newHtml)
     })
  };
}

const assetMiddleware = options => {
  const opts = options || {}
  opts.index = false

  return express.static(getAbsoluteFSPath(), opts)
}

const getAbsoluteFSPath = function () {
  // detect whether we are running in a browser or nodejs
  if (typeof module !== "undefined" && module.exports) {
    return require("path").resolve(__dirname)
  }
  throw new Error('getAbsoluteFSPath can only be called within a Nodejs environment');
}

const serve = [initFn, assetMiddleware()];

function initFn (req, res, next) {
  if (req.url === '/queue-ui-init.js') {
    res.set('Content-Type', 'application/javascript')
    console.log('serving', queueInit)
    res.send(queueInit)
  } else {
    next()
  }
}


const stringify = function (obj, prop) {
  const placeholder = '____CONTENTPLACEHOLDER____';
  let arr = [];
  let json = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'function') {
      arr.push(value);
      return placeholder;
    }
    return value;
  }, 2);
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function (_) {
    return arr.shift();
  });
  return 'var options = ' + json + ';';
};

// setup()

module.exports = {
  setup: setup,
  serve: serve,
}

// testing queue setup






