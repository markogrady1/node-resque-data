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

  {

    <% dataObj %>
      /* THIS IS TEST DATA */

      dataObj[0].num = 7000
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
  }

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
    .attr("fill", 'royalblue')
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
      console.log(i)
      tooltip
        .html(
          `<div>Queue: ${i.queue}</div><div>Jobs: ${i.num}</div>`
        )
        .style('visibility', 'visible');
      d3.select(this).transition().attr('fill', 'black');
    })
    .on('mousemove', function(d, i) {
      console.log(d.screenX)
      tooltip
        .style('top', d.screenY - 100 + 'px')
        .style('left', d.screenX - 10 + 'px');
    })
    .on('mouseout', function() {
      tooltip.html(``).style('visibility', 'hidden');
      d3.select(this).transition().attr('fill', 'steelblue');
    });


  // rect
  //     .transition()
  //     .ease(d3.easeLinear)
  //     .duration(800)
  //     .attr('y', d => y(d.num))
  //     .attr('height', d => height /2- y(d.num) + 450)
  //     .delay((d, i) => i * 100);

  tooltip = d3
    .select('div.queue-table')
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
    .attr("transform", `translate(${margin.left}, 0)`)
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



  svg.append('g')
    .attr("transform", `translate(0,${height - margin.bottom})`) // This controls the rotate position of the Axis
    .call(d3.axisBottom(x).tickFormat(i => dataObj[i].queue))
    .selectAll("text")
    .attr("transform", "translate(-10,10)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", '22px')
    .style("fill", "#000")

  svg.node();
}