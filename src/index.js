const Queue = require('./queue.js');
const express = require('express');

let queueInit;
let namespace;



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
      margin:0;
      background: #fafafa;
    }

    .container {
      width: 80%;
      margin: 0 auto;
    }
.wrapper{
width:100%;
max-width:1460px;
margin:0 auto;
padding:0 20px;
-webkit-box-sizing:border-box;
box-sizing:border-box
background-color: #1b1b1b;
    padding: 10px 0;
}
  </style>
</head>

<body>

<div class="container">
<div class='top-panel'>
  <div id="queue-list"></div>
  <div class="queue-table"></div>
<div>
  <div class="queue-pie"></div>
  <div id="queue-dohnut"></div>
</div>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="./ajax-req.js"> </script>
<script src="./queue-ui-init.js"> </script>
</body>
</html>
`


let jsTplStr = `
window.onload = function() {
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

    // dataObj.push({
    //    queue: 'foo',
    //    num: 1230
    // },{
    //   queue: 'foo1',
    //   num: 123
    // },{
    //   queue: 'foo2',
    //   num: 235
    // },{
    //   queue: 'foo3',
    //   num: 6342
    //  },{
    //    queue: 'foo4',
    //    num: 6243
    //  },{
    //    queue: 'foo5',
    //    num: 563
    //   },{
    //     queue: 'foo6',
    //     num: 23
    // }
    // )
    //
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
      const queueName = document.createTextNode(dataObj[item].queue);
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
        console.log(d)
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
        console.log(d)
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

`

let generateHTML = function(config, opts, _htmlTplString, _jsTplString) {

  if (config && typeof config === 'object') {
    config.namespace = config.namespace || 'resque'
  }

  _htmlTplString = _htmlTplString || htmlTplStr
  _jsTplString = _jsTplString || jsTplString


  const htmlWithCustomCss = _htmlTplString.toString().replace('<% customCss %>', '');
  return htmlWithCustomCss.replace('<% title %>', 'Queue UI')
}


let setup = function(config, opts) {


  return function(req, res) {
    config.uiUrl = req.originalUrl
    const html = generateHTML(config, opts, htmlTplStr, jsTplStr)
    const queue = new Queue(config);
    // var js = fs.readFileSync(__dirname + '/queue-ui-init.js.tpl');
    const testOptions = {
      uiUrl: config.uiUrl,
    }
    queueInit = jsTplStr.toString().replace('<% options %>', stringify(testOptions))
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