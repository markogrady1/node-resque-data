const Queue = require('./queue.js');
const express = require('express');

let queueInit;

let generate = function (config, opts, _htmlTplString, _jsTplString, customCss, customJs) {
  const customCssStr = customCss ? customCss : '';
  const customJsStr = customJs ? customJs : '';

  if (config && typeof config === 'object') {
    config.namespace = config.namespace || 'resque';
  }

  let pageHeader = 'Node Resque UI';
  let pageTitle = 'Node Resque UI';
  let rawJSON = false;
  if (opts && typeof opts === 'object') {
    rawJSON = opts.rawJSON || rawJSON;
    pageHeader = opts.customHeader || pageHeader;
    pageTitle = opts.customTitle || pageTitle;
  }

  if (rawJSON) {
    return true;
  }

  _htmlTplString = _htmlTplString || htmlTplStr;
  //_jsTplString = _jsTplString || jsTplString;

  _htmlTplString = _htmlTplString.toString().replace('<% customCss %>', customCssStr);
  _htmlTplString = _htmlTplString.toString().replace('<% customJs %>', customJsStr);
  const htmlWithCustomCss = _htmlTplString.toString().replace('<% customHeader %>', pageHeader);
  return htmlWithCustomCss.replace('<% title %>', pageTitle);
};

let setup = function (config, opts, customCss, customJs) {
  return function (req, res) {
    config.uiUrl = req.originalUrl;
    const html = generate(config, opts, htmlTplStr, jsTplStr, customCss, customJs);

    let displayRaw = false;
    if (html && typeof html === 'boolean' && typeof html !== 'string') {
      displayRaw = true;
    }
    const queue = new Queue(config);
    const testOptions = {
      uiUrl: config.uiUrl
    };
    queueInit = jsTplStr.toString().replace('<% options %>', stringify(testOptions));
    queue.queueForUI(config.queues, data => {
      if (displayRaw) {
        res.set('Content-Type', 'application/json');
        return res.send(data);
      }
      queueInit = queueInit.toString().replace('<% dataObj %>', stringify(data, true));
      res.send(html);
    });
  };
};

const assetMiddleware = options => {
  const opts = options || {};
  opts.index = false;

  return express.static(getAbsoluteFSPath(), opts);
};

const getAbsoluteFSPath = function () {
  // detect whether we are running in a browser or nodejs
  if (typeof module !== 'undefined' && module.exports) {
    return require('path').resolve(__dirname);
  }
  throw new Error('getAbsoluteFSPath can only be called within a Nodejs environment');
};

const serve = [initFn, assetMiddleware()];

function initFn(req, res, next) {
  if (req.url === '/queue-ui-init.js') {
    res.set('Content-Type', 'application/javascript');
    res.send(queueInit);
  } else {
    next();
  }
}

const stringify = function (obj, isData) {
  const placeholder = '____CONTENTPLACEHOLDER____';
  let arr = [];
  let json = JSON.stringify(
    obj,
    function (key, value) {
      if (typeof value === 'function') {
        arr.push(value);
        return placeholder;
      }
      return value;
    },
    2
  );
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function (_) {
    console.log(_);
    return arr.shift();
  });
  if (isData) {
    return 'var dataObj = ' + json + ';';
  }
  return 'var options = ' + json + ';';
};

let queueData = async function (config) {
  if (config && typeof config === 'object' && Array.isArray(config.queues)) {
    const queue = new Queue(config);
    const results = await queue.queueStats(config.queues);

    return results;
  }

  throw new Error("the 'queues' field cannot be missing or undefined");
};

let htmlTplStr = `
<!-- HTML for static distribution bundle build -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><% title %></title>
  <!--<link rel="stylesheet" type="text/css" href="./swagger-ui.css" >-->

  <style>
    html
    {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
    }
    *,
    *:before,
    *:after
    {
        box-sizing: inherit;
    }

    body {
      font-family: -apple-system, blinkmacsystemfont, "Segoe UI", roboto, "Noto Sans", oxygen, ubuntu, cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      margin:0;
      background: #fafafa;
    }

    .container {
      width: 60%;
      margin: 100 auto 0 auto;
    }

     .queue-table {
       width: 80%;
       margin: 0 auto;
     }

     div#queue-list {
       padding: 20px 0px 0px 100px;
       width:50%;
       margin:0 auto;
     }

     #queue-dohnut {
       width: 30%;
       margin: 0 auto;
     }

    .header {
      position: sticky;
      top: 1px;
      width: 100%;
      height: 50px;
      color: #fff;
      padding: 15px;
      background-color: #000;
    }

  </style>
  <style>
    <% customCss %>
  </style>
</head>

<body>

<header class="header"><% customHeader %></header>
<div class="container">
  <div id="queue-list"></div>
  <div class="queue-table"></div>
   <div id="queue-dohnut"></div>
</div>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="./queue-ui-init.js"> </script>
<script>
  <% customJs %>
</script>
</body>
</html>
`;

let jsTplStr = `
window.onload = data => {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);

  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }

  <% options %>
    url = options.queueUrl || url
  const urls = options.queueUrls
  const customOptions = options.customOptions
  const spec1 = options.queueDoc
  const queueOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#queue-ui',
    deepLinking: true,
    layout: "StandaloneLayout"
  }

  // create scope for barchart
  {

    <% dataObj %>
    /* THIS IS TEST DATA */

     // dataObj[0].num = 70
    dataObj[1].num = 23
    dataObj[2].num = 2
    dataObj[3].num = 1

    //dataObj.push({
    //   queue: 'foo',
    //   num: 1230
    //},{
    //  queue: 'foo1',
    //  num: 123
    //},{
    //  queue: 'foo2',
    //  num: 235
    //},{
    //  queue: 'foo3',
    //  num: 6342
    // },{
    //   queue: 'foo4',
    //   num: 6243
    // },{
    //   queue: 'foo5',
    //   num: 563
    //  },{
    //    queue: 'foo6',
    //    num: 23
    //}
    //)

  } {
    const width = 1550;
    const height = 800;
    const margin = {
      top: 100,
      bottom: 250,
      left: 100,
      right: 100
    };

    const svg = d3.select('div.queue-table')
      .append('svg')
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .attr("viewBox", [0, 0, width, height]);

    const x = d3.scaleBand()
      .domain(d3.range(dataObj.length))
      .range([margin.left, width - margin.right])
      .padding(0.1)

    const y = d3.scaleLinear()
      .domain([0, d3.max(dataObj, function(d, i) {
        return d.num;
      })])
      .range([height - margin.bottom, margin.top])

    let rect = svg
      .append("g")
      .attr("fill", 'steelblue')
      .selectAll("rect")
      .data(dataObj.sort((a, b) => d3.descending(a.num, b.num)))
      .attr('transform', 'translate(' + 100 + ',' + 100 + ')')
      .join("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d.num))
      .attr('title', (d) => d.num)
      .attr("class", "rect")
      .attr("height", d => y(0) - y(d.num))
      .attr("width", x.bandwidth())
      .on('mouseover', function(d, i) {
        tooltip
          .html(
            '<div>Queue: ' + i.queue + '</div><div>Jobs: ' + i.num + '</div>'
          )
          .style('visibility', 'visible')
        d3.select(this).transition().attr('fill', '#428BCA');
      })
      .on('mousemove', function(d, i) {
        tooltip
          .style('top', d.screenY - 100 + 'px')
          .style('left', d.screenX - 10 + 'px');
      })
      .on('mouseout', function() {
        tooltip.html('').style('visibility', 'hidden');
        d3.select(this).transition().attr('fill', '#4682B4');
      });


    const tooltip = tip('div.queue-table')

    svg.selectAll('.bar-label')
      .data(dataObj)
      .enter()
      .append('text')
      .classed('bar-label', true)

      .attr('x', function(d, i) {
        return x(i) + x.bandwidth() / 3;
      })
      .attr('y', function(d, i) {
        return y(d.num + 0.01);
      })
      .text(function(d, i) {
        return d.num;
      })
      .style("font-size", 24)

    const epsilon = Math.pow(10, -7);
    svg.append('g')
      .attr("transform", 'translate(' + margin.left + ', 0)')
      .call(d3.axisLeft(y).ticks(null).tickFormat(function(d) {
        if (((d - Math.floor(d)) > epsilon) && ((Math.ceil(d) - d) > epsilon))
          return;
        return d;
      }))
      .attr("font-size", '20px')



    svg.append('g')
      .classed('x axis', true)
      .attr('transform', 'translate(' + 0 + ',' + height + ')')

      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', -8)
      .attr('dy', 8)
      .attr('transform', 'translate(0,0) rotate(-45)');
    svg.append('g')
      .classed('y axis', true)
      .attr('transform', 'translate(0,0)')

    svg.select('.y.axis')
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .style('text-anchor', 'middle')
      .style('font-size', '30px')
      .attr('transform', 'translate(-10, ' + height / 2 + ') rotate(-90)')
      .text('No. of Jobs');

    svg.select('.x.axis')
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .classed('x-axis-title', true)
      .style('text-anchor', 'middle')
      .style('font-size', '30px')
      .attr('transform', 'translate(' + width / 2 + ', -10)')
      .text("Queues");

    const translateValue = height - margin.bottom;
    svg.append('g')
      .attr("transform", 'translate(0,' + translateValue + ')') // This controls the rotate position of the Axis
      .call(d3.axisBottom(x).tickFormat(i => dataObj[i].queue))
      .selectAll("text")
      .attr("transform", "translate(-10,10)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", '22px')
      .style("fill", "#000")

    svg.node();

    const listEl = document.getElementById('queue-list');
    const node = document.createElement('ul'); // Create a <li> node
    listEl.appendChild(node);
    for (let item in dataObj) {
      const li = document.createElement('li');
      const queueName = document.createTextNode(dataObj[item].queue + ': ' + dataObj[item].num);
      li.appendChild(queueName)
      node.appendChild(li)

    }
  }

  // create scope for pie chart

  {
    // set the dimensions and margins of the graph
    const width = 450
    const height = 450
    const margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'queue-dohnut'
    let tooltip = tip("#queue-dohnut");
    const svg = d3.select("#queue-dohnut")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .data(dataObj.sort((a, b) => d3.descending(a.num, b.num)))
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

    // set the color scale
    const color = d3.scaleOrdinal()
      .domain(dataObj)
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])

    // Compute the position of each group on the pie:
    const pie = d3.pie()
      .value(function(d) {
        return d.num;
      })

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    const paths = svg
      .selectAll('svg')
      .data(pie(dataObj))
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(100)
        .outerRadius(radius)
      )
      .attr('fill', function(d) {
        return (color(d.data.queue))
      })
      .attr('class', 'label')
      .attr("stroke", "black")
      .style("stroke-width", "2px")

      .transition().duration(1000)
      .style("opacity", 0.7)


    d3.selectAll('.label')
      .data(dataObj)
      .on("mouseover", function(d, i) {
        tooltip.html(
          '<div>Queue: ' + i.queue + '</div><div>Jobs: ' + i.num + '</div>'
        );
        tooltip.text();
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(d, i) {
        return tooltip.style("top", (d.pageY - 10) + "px").style("left", (d.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        return tooltip.style("visibility", "hidden")
      });
  }

  function tip(element) {
    return d3.select(element)
      .append('div')
      .attr('class', 'd3-tooltip')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('padding', '10px')
      .style('background', 'rgba(0,0,0,0.6)')
      .style('border-radius', '4px')
      .style('color', '#fff')
      .text('a simple tooltip');
  }
}
`;

module.exports = {
  setup: setup,
  serve: serve,
  queueData: queueData
};
