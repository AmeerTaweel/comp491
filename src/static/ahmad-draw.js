var margin = {top: 30, right: 30, bottom: 30, left: 30},
width = 1200 - margin.left - margin.right,
height = 1200 - margin.top - margin.bottom;
var nodeRadius = 60

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

function draw_g (graph) {
        simulation.force("link", d3.forceLink().distance(graph.nodes.length * 200).id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))

        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    var link = svg
        .append("svg:g")
        .attr("class", "links")
        .selectAll('path')
        .data(graph.links)
        .enter()
        .append('svg:path')
        .attr("class", "link")
        .attr("id", d => "link" + d.source.id + "-" + d.target.id)
        .style("fill", "none")
        .attr("stroke", d => color(d.source.id))
        .attr("stroke-width", d => d.coms + 1)
        .attr("stroke", d => color(d.source.id))
        .attr("marker-end", d => "url(#arrowhead" + d.source.id + ")")


    // arrows heads
    svg.append('defs')
        .selectAll('marker')
        .data(graph.links)
        .enter()
        .append('marker')
        .attr('id', d =>'arrowhead' + d.source.id)
        .attr('viewBox','-0 -5 10 10')
        .attr('refX', 5)
        .attr('refY', 0)
        .attr('orient','auto')
        .attr('xoverflow','visible')
        .attr("markerWidth",  "20")
        .attr("markerHeight", "20")
        // makes the stroke width irrelevant and only uses markerWidth and markerHeight
        .attr('markerUnits', 'userSpaceOnUse')             
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr("stroke", d => color(d.source.id))
        .attr("fill", d => color(d.source.id))

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", nodeRadius)
        .attr("fill", function(d) { 
            return color(d.id); })
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

    
    var text = svg.append("g")
        .attr("class", "labels")
        .selectAll("g")
            .attr("dy", "-40")
            .data(graph.nodes)
            .enter().append("g");

    // labels for edges
    svg.selectAll(".comsText")
        .data(graph.links)
        .enter().append("text")
        .style("font-family", "Arial")
        .style("font-size", "40px")
        .attr("font-weight", "bold")
        .attr("stroke", "white")
        .attr("class", "arclabels")
        .attr("dy", 16)
        .append("textPath")
        .text(d => d.coms)
        .attr("xlink:href", d => "#link"+d.source.id+"-"+d.target.id)
        .attr("startOffset","50%")
        .style("text-anchor","end")




    text.append("text")
        .style("font-family", "sans-serif")
        .style("font-size", "20px")
        .text(function(d) { return d.label; });

    node.append("title")
        .text(function(d) { return d.label; });
    
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

              return "M" + d.source.x + "," + d.source.y 
                + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });
    link.attr("d", function(d) {

          // length of current path
          var pl = this.getTotalLength(),
            // radius of circle plus backoff
            r = nodeRadius + 10,
            // position close to where path intercepts circle
            m = this.getPointAtLength(pl - r);

          var dx = m.x - d.source.x,
            dy = m.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);

          return "M" + d.source.x + "," + d.source.y 
            + "A" + dr + "," + dr + " 0 0,1 " + m.x + "," + m.y;
    });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    text
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  }
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
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}
