var margin = {top: 30, right: 30, bottom: 30, left: 30},
width = 1200 - margin.left - margin.right,
height = 1200 - margin.top - margin.bottom;

var svg = d3.select("#canvas1")
    .append("div")
    .attr("class", "chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(d3.zoom().on("zoom", zoomed))
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

var color = d3.scaleOrdinal(d3.schemeCategory10);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(500).id(function(d) { return d.id; }))
    // .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))

function draw_g (graph) {
    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    // console.log(graph)
  // if (error) throw error;

    svg.append("svg:defs").selectAll("marker")
        .data(["end"])
        .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");
    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 60)
        .attr("fill", function(d) { if (d.root == "true") return color(d.root); return color(d.type); })
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
    var text = svg.append("g").attr("class", "labels").selectAll("g")
            .data(graph.nodes)
            .enter().append("g");

    var link = svg
        .append("svg:g")
        .attr("class", "links")
        .selectAll('path')
        .data(graph.links)
        .enter()
        .append('svg:path')
        .attr("class", "link")
        .style("fill", "none")
        .attr("stroke", "black")
        .attr("marker-end", "url(#end)")

        // .append("text")
        //     .attr("x", 12)
            // .attr("dy", ".35em")
            // .text(function(d) { return d.coms; });
        // .attr("stroke-width", function(d){return 3;})
     var linktext = svg.append("g").attr("class", "labels").selectAll("g")
            .data(graph.links)
            .enter().append("g");
  

    text.append("text")
        .style("font-family", "sans-serif")
        .style("font-size", "20px")
        .text(function(d) { return d.label; });
    linktext.append("text")
        .style("font-family", "sans-serif")
        .style("font-size", "20px")
        .text(function(d) { return d.coms; });

    node.append("title")
        .text(function(d) { return d.label; });
    // link
    //     .append("g")
    //     .attr("x", d => d.x)
    //     .attr("y", d => d.y)
    //     .selectAll("g")
    //     .data(graph.links)
    //     // .enter()
    //     .append("text")
    //     // .append("textPath")
    //     // .attr("xlink:href", function (d,i) { return "#path_" + i; })
    //     .text(function (d) { return "path_" + d.coms; });

    
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .attr("d", function(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                var r = 0
                var startx = d.source.x - r,
                starty = d.source.y - r,
                endx = d.target.x - r,
                endy = d.target.y - r
                return "M" + 
                    startx + "," + 
                    starty + "A" + 
                    dr + "," + dr + " 0 0,1 " + 
                    endx + "," + 
                    endy;
            });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    text
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    linktext
        .attr("transform", function(d) { return "translate(" + (d.source.x+d.target.x)/2 + "," + (d.source.y+d.target.y)/2 + ")"; });
  }
  svg.selectAll()
      .data(data, function(d) {return d.index;})
      .enter()
      .append("rect")

}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function zoomed() {
  svg.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ")" + " scale(" + d3.event.transform.k + ")");
}
function linkArc(d) {
    // console.log(d.source)
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}
