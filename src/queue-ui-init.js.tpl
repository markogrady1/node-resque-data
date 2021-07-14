window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  console.log(url)
  console.log(options)
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
    const div = d3.select("div.queue-table")
      .style("font", "10px sans-serif")
      .style("text-align", "right")
      .style("color", "white");

    div.selectAll("div")
      .data(dataObj)
      .join("div")
      .style("background", "steelblue")
      .style("padding", "3px")
      .style("margin", "1px")
      .style("width", d => `${d.num * 10}px`)
      .text(d => d.num)
      .attr("class", function(d) {
        return d.queue;
      });
    return div.node();
  }
}